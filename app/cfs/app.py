from flask import (
    Flask,
    render_template,
    request,
    g,
    session,
    jsonify
)

from flask.ext.script     import Manager
from flask.ext.bootstrap  import Bootstrap
from flask.ext.sqlalchemy import SQLAlchemy

from sqlalchemy.dialects.postgresql import psycopg2
from sqlalchemy import create_engine, select
from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey
from sqlalchemy.sql import text
import psycopg2
import sqlalchemy

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


@app.route('/')
def index():
    data = g.db.execute(select([Transactions]).limit(25)).fetchall()
    return render_template('index.html', data = data)


if __name__ == '__main__':
    manager.run()
    
    
