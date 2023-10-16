import os
from sqlalchemy import create_engine
from sqlalchemy import text
import pandas as pd
import re

# Get a database connection
def db_connection():
    DATABASE_URL = re.sub(r'\bpostgres\b', 'postgresql',os.environ.get('DATABASE_URL'))
    return create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

# Executes a command with no expectation of returning data
def execute_command_no_return(sql_command):
    conn = db_connection()
    with conn.connect() as connection:
        connection.execute(text(sql_command))
        connection.commit()
        connection.close()
    conn.dispose()

# Executes a command and returns data from the SQL server as a pandas dataframe
def execute_query(sql_query):
    conn = db_connection()
    ret = pd.read_sql(sql_query, con=conn)
    conn.dispose()
    return ret

# Inserts a dataframe into a table
def insert_dataframe_into_table(df, table_name):
    conn = db_connection()
    df.to_sql(table_name, con=conn, if_exists='append', index=False)
    conn.dispose()