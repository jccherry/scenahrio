from python_modules.db_connect import execute_command_no_return, execute_query, insert_dataframe_into_table
import pandas as pd
import re
import hashlib
import datetime

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

def add_profile_to_database(profile_json, user_sub):
    print(profile_json)
    id_to_hash = f"{user_sub}{profile_json['Name']}{datetime.datetime.now()}"
    print(f"id_to_hash = {id_to_hash}")
    unique_id = hashlib.sha256(id_to_hash.encode()).hexdigest()

    print(profile_json)
    profile_df = dict_to_dataframe(profile_json, normalize_headers=True)
    profile_df.insert(0, 'user_sub', [user_sub])
    profile_df.insert(0, 'profile_id', [unique_id])
    insert_dataframe_into_table(profile_df,'profiles')

def delete_profile_from_database(profile_id):
    cmd = f"DELETE FROM profiles WHERE profile_id = '{profile_id}'"
    print(cmd)
    execute_command_no_return(cmd)

def get_user_profiles(user_sub):
    print("Getting the users's profiles")
    return execute_query(f"SELECT * FROM profiles WHERE user_sub = '{user_sub}' ORDER BY name;")

def edit_user_profile(user_profile):
    print("editing a user's employee profile")
    cmd = f"""
    UPDATE
        profiles
    SET
        name = '{user_profile['name']}'
        , age = {user_profile['age']}
        , gender = '{user_profile['gender']}'
        , job_title = '{user_profile['job_title']}'
        , notes = '{user_profile['notes']}'
        , years_experience = '{user_profile['years_experience']}'
    WHERE
        profile_id = '{user_profile['profile_id']}'
        AND user_sub = '{user_profile['user_sub']}'
    """
    print(cmd)
    execute_command_no_return(cmd)

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
