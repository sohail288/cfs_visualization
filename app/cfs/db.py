import sqlalchemy
from sqlalchemy.dialects.postgresql import psycopg2
from sqlalchemy import create_engine, select, case
from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey
from sqlalchemy.sql import text, and_, or_, desc


def getAddressAndPort(instance_identifier):
    import boto3
    rds = boto3.client('rds')

    instance =filter(
        lambda instance: instance['DBInstanceIdentifier'] == instance_identifier,
                           rds.describe_db_instances()['DBInstances'])
    endpoint= list(instance)[0]['Endpoint']
    address, port = endpoint['Address'], endpoint['Port']
    return address, port

username = 'TestUser'
password = 'TestPassword'
db_name  = 'cfsdb'
address, port = getAddressAndPort(db_name)

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
FIPS_States   = META.tables['FIPS_States']
CFS_Areas     = META.tables['cfs_areas']
State_LatLon  = META.tables['state_latlon']
NAICS         = META.tables['naics']
Transactions_Joined = META.tables['transactions_joined']




# Simple row getters
get_row = lambda row: (dict(row.items()))
get_rows = lambda row_list: map(get_row, row_list)
