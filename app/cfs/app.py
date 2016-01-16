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

import json
import re

import pandas as pd

import queries
from db import ENGINE, get_rows

QUERY_LIMIT = QL = 100 

app = Flask(__name__)

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

app.add_url_rule('/usa-map-data', 'root', 
                 lambda: app.send_static_file('assets/geo/usa.json'))

@app.route('/')
def index():
    return render_template('index.html')

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

    data = list(get_rows(g.db.execute(q.limit(QL)).fetchall()))
    return Response(json.dumps(data, indent=2), mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})

@app.route('/states/<orig_state>')
def transactionsFromState(orig_state):
    """ Get Top N Transactions For State """
    q = queries.transactionsFromState.params(orig_code=orig_state)

    data = list(get_rows(g.db.execute(q.limit(QL)).fetchall()))
    return Response(json.dumps(data, indent=2), mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})

@app.route('/states/<orig_state>/<dest_state>/info/<info>')
def  get_stats(orig_state, dest_state, info):
    q = queries.transactionsBetweenStates.params(orig_code=orig_state,
                                                 dest_code=dest_state)

    try:
        data = pd.read_sql_query(q.limit(QL), ENGINE).groupby(['orig_alpha_code', 'dest_alpha_code'])[info].describe()
    except Exception as e:
        return Response(str(e) + " is not a correct column to groupby")

    return Response(data.to_json(orient="records"), mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})




@app.route('/states/<orig_state>/info/<info>/counts')
def get_counts_from_state(orig_state, info):
    q = queries.transactionsFromState.params(orig_code=orig_state)

    try:
        data = pd.read_sql_query(q.limit(QL), ENGINE)[info].value_counts()
        serialized = [{'code':str(k), 
                       'Description': "{}_{}".format(info, str(k)),
                       'counts': str(v)} for k,v in data.sort_index().to_dict().items()]
    except Exception as e:
        return Response(str(e) +" is not a correct column")

    return Response(json.dumps(serialized, indent=2),
                    mimetype="application/json",
                    headers={'Cache-Control': 'no-cache'})
                                        

@app.route('/states/<orig_state>/<dest_state>/info/<info>/counts')
def get_counts_between_state(orig_state, dest_state, info):
    q = queries.transactionsBetweenStates.params(orig_code=orig_state, dest_code=dest_state)

    try:
        data = pd.read_sql_query(q.limit(QL), ENGINE)[info].value_counts()
        serialized = [{'code':str(k),
                       'Description': "{}_{}".format(info, str(k)),
                       'counts':str(v)} for k,v in data.sort_index().to_dict().items()]
    except Exception as e:
        return Response(str(e) +" is not a correct column")

    return Response(json.dumps(serialized, indent=2),
                    mimetype="application/json",
                    headers={'Cache-Control': 'no-cache'})



@app.route('/states/<orig_state>/<dest_state>/info/<info>/break_down')
def get_breakdown(orig_state, dest_state, info):
    column_code = queries.code_translate[info]
    q = queries.transactionsBetweenStates.params(orig_code=orig_state,
                                                 dest_code=dest_state)
    a = queries.getAux(info)
    
    try:
        data = pd.DataFrame({'counts': pd.read_sql_query(q.limit(QL), ENGINE).groupby(info)[info].count()})
        appendix = pd.read_sql_query(a, ENGINE)
        if data.index.dtype != appendix[column_code].dtype:
            appendix[column_code] = appendix[column_code].astype(str)

        m = pd.merge(appendix, data, left_on=column_code, right_index=True)
        
        # convert all numeric-code columns to be named code for easier manip
        m = m.rename(columns={column_code:'code'})

        # for some reason the mode table has a diff name for description column
        if info == 'MODE':
            m = m.rename(columns={'Mode Description':'Description'})

    except Exception as e:
        return Response(str(e) + " is not a correct column to groupby")
    
    return Response(m.to_json(orient="records"),
                    mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})


@app.route('/states/<orig_state>/info/<info>/break_down')
def get_breakdown_from_state(orig_state, info):
    column_code = queries.code_translate[info]
    q = queries.transactionsFromState.params(orig_code=orig_state)
    a = queries.getAux(info)

    try:
        data = pd.DataFrame({'counts': pd.read_sql_query(q.limit(QL), ENGINE).groupby(info)[info].count()})
        appendix = pd.read_sql_query(a, ENGINE)
        if data.index.dtype != appendix[column_code].dtype:
            appendix[column_code] = appendix[column_code].astype(str)
        
        m = pd.merge(appendix, data, left_on=column_code, right_index=True)
        m = m.rename(columns={column_code:'code'})
        if info == 'MODE':
            m = m.rename(columns={'Mode Description': 'Description'})
    except Exception as e:
        return Response(str(e))

    return Response(m.to_json(orient="records"),
                    mimetype='application/json',
                    headers={'Cache-Control': 'no-cache'})


#@app.route('/appendix/<name>')
#def get_sctg_info(name):
#    s = { 'sctg': queries.SCTG,
#          'mode': queries.TransportMode,
#          'naics': queries.NAICS
#        }.get(name, None)
#
#    if s is not None:
#    
#        data = list(get_rows(g.db.execute(
#            queries.select([s])).fetchall()))
#
#        return Response(json.dumps(data, indent=2), 
#                        mimetype='application/json',
#                        headers={'Cache-Control': 'no-cache'})
#    return Response("table does not exist")
#
                    


if __name__ == '__main__':
    manager.run()
    
    
