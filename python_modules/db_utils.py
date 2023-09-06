from python_modules.db_connect import execute_command_no_return, execute_query, insert_dataframe_into_table
import pandas as pd

# Add a user to the database if they don't exist already
def add_user_to_database(user_json):

    user_id = user_json['sub']
    user_entry = execute_query(f"SELECT * FROM users WHERE sub = '{user_id}'")

    if user_entry.empty:
        print(f"Adding user with sub = {user_id} to database...")
        user_df = pd.DataFrame.from_dict(user_json, orient='index').T
        insert_dataframe_into_table(user_df, 'users')
    else:
        print(f"User with sub = {user_id} already exists in database.")
