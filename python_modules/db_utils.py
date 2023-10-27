from python_modules.db_connect import execute_command_no_return, execute_query, insert_dataframe_into_table
import pandas as pd
import re
import hashlib
import datetime

# create a unique ID by hashing
def create_id_hash(string_to_hash):
    id_to_hash = f"string_to_hash{datetime.datetime.now()}"
    unique_id = hashlib.sha256(id_to_hash.encode()).hexdigest()
    return unique_id

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

    string_to_hash = f"{user_sub}{profile_json['Name']}"
    unique_id = create_id_hash(string_to_hash)

    print(profile_json)
    profile_df = dict_to_dataframe(profile_json, normalize_headers=True)
    profile_df.insert(0, 'user_sub', [user_sub])
    profile_df.insert(0, 'profile_id', [unique_id])
    insert_dataframe_into_table(profile_df,'profiles')

def delete_profile_from_database(profile_id, user_sub):
    cmd = f"DELETE FROM profiles WHERE profile_id = '{profile_id}' AND user_sub = '{user_sub}'"
    print(cmd)
    execute_command_no_return(cmd)

def delete_scenario_from_database(scenario_id, user_sub):
    cmd = f"""
        DELETE FROM
            scenarios
        WHERE
            scenario_id = '{scenario_id}'
            AND user_sub = '{user_sub}'
        ;
    """
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

def add_scenario_to_database(scenario_json, user_sub):
    print(scenario_json)
    
    profile_id = scenario_json['employee']['profile_id']
    id_to_hash = f"{profile_id}{user_sub}__scenario"
    scenario_id = create_id_hash(id_to_hash)

    insert_dict = {
        'user_sub': user_sub
        , 'scenario_id': scenario_id
        , 'profile_id': profile_id
        , 'scenario_name' : scenario_json['name']
        , 'desired_outcome' : scenario_json['desiredOutcome']
        , 'context' : scenario_json['context']
        , 'contents' : '{}'
    }

    insert_dataframe_into_table(dict_to_dataframe(insert_dict), 'scenarios')

    print(insert_dict)

def get_scenario_list(user_sub):
    query = f"""
    SELECT
        s.user_sub
        , s.scenario_id
        , s.profile_id
        , p.name profile_name
        , s.scenario_name
        , s.desired_outcome
        , s.context
    FROM
        scenarios s
        LEFT JOIN profiles p ON
            s.user_sub = p.user_sub
            AND s.profile_id = p.profile_id
    WHERE
        s.user_sub = '{user_sub}'
    ORDER BY
        scenario_name
    ;
    """
    return execute_query(query)

def edit_scenario_settings_from_json(scenario_json):
    print("editing a scenario")
    cmd = f"""
    UPDATE
        scenarios
    SET
        scenario_name = '{scenario_json['scenario_name']}'
        , desired_outcome = '{scenario_json['desired_outcome']}'
        , context = '{scenario_json['context']}'
    WHERE
        scenario_id = '{scenario_json['scenario_id']}'
        AND profile_id = '{scenario_json['profile_id']}'
        AND user_sub = '{scenario_json['user_sub']}'
    ;
    """
    execute_command_no_return(cmd)

def get_scenario_from_ids(scenario_id, user_sub):
    query = f"""
        SELECT
            s.scenario_name
            , s.scenario_id
            , s.context
            , s.desired_outcome
            , s.contents
            , p.name profile_name
            , p.age profile_age
            , p.job_title profile_job_title
            , p.gender profile_gender
        FROM
            scenarios s
            LEFT JOIN profiles p ON
                p.profile_id = s.profile_id
                AND s.user_sub = p.user_sub
        WHERE
            s.scenario_id = '{scenario_id}'
            AND s.user_sub = '{user_sub}'
    """
    ret = execute_query(query)
    return ret
