from sqlalchemy.sql import text, and_, or_, bindparam
from sqlalchemy     import select, desc

from db import *


_aux = {
    'SCTG': SCTG,
    'NAICS': NAICS,
    'MODE': TransportMode
}

state_latlon_joined = FIPS_States.join(
    State_LatLon, onclause=State_LatLon.c.state == FIPS_States.c["Alpha code"])

orig = state_latlon_joined.alias("orig")

dest = state_latlon_joined.alias("dest")

transactionsFromState = (select([Transactions_Joined])
                         .where(Transactions_Joined.c.orig_alpha_code == bindparam("orig_code"))
                          .order_by(desc(Transactions_Joined.c.SHIPMT_VALUE)))




transactionsBetweenStates = (select([Transactions_Joined])
                                 .where(
                Transactions_Joined.c.orig_alpha_code==bindparam("orig_code"))
                                  .where(
                Transactions_Joined.c.dest_alpha_code==bindparam("dest_code"))
)


code_translate = {
    'SCTG': 'SCTG',
    'MODE': 'Mode Code',
    'NAICS': 'NAICS'
}


def getAux(col):
    return select([_aux[col]])

def getValues(col):
    pass 

    



