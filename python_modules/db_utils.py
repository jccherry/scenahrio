from python_modules.db_connect import execute_command_no_return, execute_query, insert_dataframe_into_table
import pandas as pd
import re

# Add a user to the database if they don't exist already
def add_user_to_database(user_json):

    user_id = user_json['sub']
    user_entry = execute_query(f"SELECT * FROM users WHERE sub = '{user_id}'")

    if user_entry.empty:
        print(f"Adding user with sub = {user_id} to database...")
        user_df = dict_to_dataframe(user_json)
        insert_dataframe_into_table(user_df, 'users')
    else:
        print(f"User with sub = {user_id} already exists in database.")

def add_profile_to_database(profile_json, user_aud):
    print(profile_json)
    profile_df = dict_to_dataframe(profile_json, normalize_headers=True)
    profile_df.insert(0, 'user_aud', [user_aud])
    insert_dataframe_into_table(profile_df,'profiles')

def dict_to_dataframe(dict_data, normalize_headers=False):
    
    df = pd.DataFrame.from_dict(dict_data, orient='index').T

    if normalize_headers:
        print("NORMALIZING")
        # Function to convert strings to snake_case
        def snake_case(text):
            text = re.sub(r'[^a-zA-Z0-9]', ' ', text)
            words = text.split()
            return '_'.join(words).lower()
        
        # Normalize the column names using snake_case
        column_names = [snake_case(key) for key in dict_data.keys()]
        print(column_names)

        df.columns = column_names

    # Create a DataFrame with a single row using a list comprehension
    #df = pd.DataFrame(data, columns=column_names)
    return df
