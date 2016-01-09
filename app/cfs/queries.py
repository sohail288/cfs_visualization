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


#transactionsFromState = text("""
#        SELECT transactions.*,
#            orig."Name" as orig_name,
#            orig."Alpha code" as orig_alpha_code,
#            orig."latitude" as orig_lat,
#            orig."longitude" as orig_lon,
#            dest."Name" as dest_name,
#            dest."Alpha code" as dest_alpha_code,
#            dest."latitude" as dest_lat,
#            dest."longitude" as dest_lon
#        FROM transactions
#        JOIN (
#            SELECT states.*, lonlats.*
#            FROM "FIPS_States" states
#            JOIN state_latlon lonlats
#            on states."Alpha code"=lonlats.state
#             ) orig
#            ON orig."Numeric code" = transactions."ORIG_STATE"
#        JOIN (
#            SELECT states.*, lonlats.*
#            FROM "FIPS_States" states
#            JOIN state_latlon lonlats
#            on states."Alpha code"=lonlats.state
#             ) dest
#            ON dest."Numeric code" = transactions."DEST_STATE"
#        WHERE orig."Alpha code"=:orig_code
#        ORDER BY transactions."SHIPMT_VALUE" DESC
#        LIMIT 20
#        """)


#transactionsFromState = (select([Transactions,
#              orig.c.FIPS_States_Name.label("orig_name"),
#              orig.c["FIPS_States_Alpha code"].label("orig_alpha_code"),
#              dest.c["FIPS_States_Name"].label("dest_name"),
#              dest.c["FIPS_States_Alpha code"].label("dest_alpha_code"),
#              orig.c.state_latlon_latitude.label("orig_lat"),
#              orig.c.state_latlon_longitude.label("orig_lon"),
#              dest.c.state_latlon_latitude.label("dest_lat"),
#              dest.c.state_latlon_longitude.label("dest_lon")])
#        .select_from(Transactions
#                    .join(orig, Transactions.c.ORIG_STATE == orig.c["FIPS_States_Numeric code"])
#                    .join(dest, Transactions.c.DEST_STATE == dest.c["FIPS_States_Numeric code"]))
#        .where(orig.c["FIPS_States_Alpha code"] == bindparam("orig_code"))
#        .order_by(desc(Transactions.c.SHIPMT_VALUE)))


transactionsFromState = (select([Transactions_Joined])
                         .where(Transactions_Joined.c.orig_alpha_code == bindparam("orig_code"))
                          .order_by(desc(Transactions_Joined.c.SHIPMT_VALUE)))


#transactionsBetweenStates = text("""
#        SELECT transactions.*,
#            orig."Name" as orig_name,
#            orig."Alpha code" as orig_alpha_code,
#            orig."latitude" as orig_lat,
#            orig."longitude" as orig_lon,
#            dest."Name" as dest_name,
#            dest."Alpha code" as dest_alpha_code,
#            dest."latitude" as dest_lat,
#            dest."longitude" as dest_lon
#        FROM transactions
#        JOIN (
#            SELECT states.*, lonlats.*
#            FROM "FIPS_States" states
#            JOIN state_latlon lonlats
#            on states."Alpha code"=lonlats.state
#             ) orig
#            ON orig."Numeric code" = transactions."ORIG_STATE"
#        JOIN (
#            SELECT states.*, lonlats.*
#            FROM "FIPS_States" states
#            JOIN state_latlon lonlats
#            on states."Alpha code"=lonlats.state
#             ) dest
#            ON dest."Numeric code" = transactions."DEST_STATE"
#        WHERE dest."Alpha code"=:dest_code AND orig."Alpha code"=:orig_code
#        LIMIT 100
#        """)

#transactionsBetweenStates = (select([Transactions,
#              orig.c.FIPS_States_Name.label("orig_name"),
#              orig.c["FIPS_States_Alpha code"].label("orig_alpha_code"),
#              dest.c["FIPS_States_Name"].label("dest_name"),
#              dest.c["FIPS_States_Alpha code"].label("dest_alpha_code"),
#              orig.c.state_latlon_latitude.label("orig_lat"),
#              orig.c.state_latlon_longitude.label("orig_lon"),
#              dest.c.state_latlon_latitude.label("dest_lat"),
#              dest.c.state_latlon_longitude.label("dest_lon")])
#        .select_from(Transactions
#                    .join(orig, Transactions.c.ORIG_STATE == orig.c["FIPS_States_Numeric code"])
#                    .join(dest, Transactions.c.DEST_STATE == dest.c["FIPS_States_Numeric code"]))
#        .where(orig.c["FIPS_States_Alpha code"] == bindparam("orig_code"))
#        .where(dest.c["FIPS_States_Alpha code"] == bindparam("dest_code")))
#"""


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
    #return select([Transactions_Joined.c[col]]).from_select


