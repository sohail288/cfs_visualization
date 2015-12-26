from flask import (
    Flask,
    render_template,
    request,
    g,
    session,
    jsonify,
    Response
)

from flask.ext.script     import Manager
from flask.ext.bootstrap  import Bootstrap
from flask.ext.sqlalchemy import SQLAlchemy

import sqlalchemy
from sqlalchemy.dialects.postgresql import psycopg2
from sqlalchemy import create_engine, select, case 
from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey
from sqlalchemy.sql import text, and_, or_, desc

import json
import queries

import pandas as pd

QUERY_LIMIT = QL = 10

app = Flask(__name__)

username = 'TestUser'
password = 'TestPassword'
address  = 'cfsdb.cs4yyoqmq4gl.us-west-1.rds.amazonaws.com'
port     =  5432
db_name  = 'cfsdb'

DATABASE_URI = 'postgresql+psycopg2://{username}:{password}@{add}:{port}/{db_name}'.format(
    username=username,
    password=password,
    add=address,
    port=port,
    db_name=db_name)

ENGINE =  create_engine(DATABASE_URI)
META = MetaData()
META.reflect(ENGINE)

Transactions  = META.tables['transactions']
SCTG          = META.tables['sctg']
TransportMode = META.tables['transport_mode']
States        = META.tables['FIPS_States']
CFS_Areas     = META.tables['cfs_areas']
State_LatLon  = META.tables['state_latlon']

app.config.from_object(__name__)
app.config.from_envvar("CFS_SETTINGS", silent=True)

db = ENGINE

bootstrap = Bootstrap(app)
manager = Manager(app)


get_row = lambda row: (dict(row.items()))
get_rows = lambda row_list: map(get_row, row_list)

def connect_db():
    db.connect()
    

@app.before_request
def before_request():
    g.db = db.connect()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

app.add_url_rule('/usa-map-data', 'root', 
                 lambda: app.send_static_file('assets/geo/usa.json'))

@app.route('/')
def index():
    data = g.db.execute(select([Transactions]).limit(25)).fetchall()
    return render_template('index.html', data = data)

@app.route('/test-data', methods=['GET'])
def test_data():
    data = None

    with open('static/assets/jsx/testdata.json', 'r') as f:
        data = json.loads(f.read())

    return Response(json.dumps(data), mimetype='application/json',
        headers={'Cache-Control': 'no-cache'})


@app.route('/states/<orig_state>/<dest_state>')
def transactionBetweenStates(orig_state, dest_state):
    q = queries.transactionsBetweenStates.params(
        orig_code=orig_state, 
        dest_code=dest_state)

    data = list(get_rows(g.db.execute(q).fetchall()))
    return Response(json.dumps(data, indent=2), mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})

@app.route('/states/<orig_state>')
def transactionsFromState(orig_state):
    """ Get Top N Transactions For State """
    q = queries.transactionsFromState.params(orig_code=orig_state)
   

    

    data = list(get_rows(g.db.execute(q).fetchall()))
    return Response(json.dumps(data, indent=2), mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})

@app.route('/states/<orig_state>/<dest_state>/info/<info>')
def  get_stats(orig_state, dest_state, info):
    q = queries.transactionsBetweenStates.params(orig_code=orig_state,
                                                 dest_code=dest_state)

    try:
        data = pd.read_sql_query(q, ENGINE).groupby(['orig_alpha_code', 'dest_alpha_code'])[info].describe()
    except Exception as e:
        return Response(str(e) + " is not a correct column to groupby")

    return Response(data.to_json(orient="records"), mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})
    


if __name__ == '__main__':
    manager.run()
    
    
