from sqlalchemy.sql import text

transactionsFromState = text("""
        SELECT transactions.*,
            orig."Name" as orig_name,
            orig."Alpha code" as orig_alpha_code,
            orig."latitude" as orig_lat,
            orig."longitude" as orig_lon,
            dest."Name" as dest_name,
            dest."Alpha code" as dest_alpha_code,
            dest."latitude" as dest_lat,
            dest."longitude" as dest_lon
        FROM transactions
        JOIN (
            SELECT states.*, lonlats.*
            FROM "FIPS_States" states
            JOIN state_latlon lonlats
            on states."Alpha code"=lonlats.state
             ) orig
            ON orig."Numeric code" = transactions."ORIG_STATE"
        JOIN (
            SELECT states.*, lonlats.*
            FROM "FIPS_States" states
            JOIN state_latlon lonlats
            on states."Alpha code"=lonlats.state
             ) dest
            ON dest."Numeric code" = transactions."DEST_STATE"
        WHERE orig."Alpha code"=:orig_code
        ORDER BY transactions."SHIPMT_VALUE" DESC
        LIMIT 20
        """)


transactionsBetweenStates = text("""
        SELECT transactions.*,
            orig."Name" as orig_name,
            orig."Alpha code" as orig_alpha_code,
            orig."latitude" as orig_lat,
            orig."longitude" as orig_lon,
            dest."Name" as dest_name,
            dest."Alpha code" as dest_alpha_code,
            dest."latitude" as dest_lat,
            dest."longitude" as dest_lon
        FROM transactions
        JOIN (
            SELECT states.*, lonlats.*
            FROM "FIPS_States" states
            JOIN state_latlon lonlats
            on states."Alpha code"=lonlats.state
             ) orig
            ON orig."Numeric code" = transactions."ORIG_STATE"
        JOIN (
            SELECT states.*, lonlats.*
            FROM "FIPS_States" states
            JOIN state_latlon lonlats
            on states."Alpha code"=lonlats.state
             ) dest
            ON dest."Numeric code" = transactions."DEST_STATE"
        WHERE dest."Alpha code"=:dest_code AND orig."Alpha code"=:orig_code
        LIMIT 100
        """)
