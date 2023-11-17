from flask import Flask, session, request, jsonify
from python_modules.db_utils import *
from python_modules.chat_session import *
from dotenv import load_dotenv

import os

app = Flask(__name__, static_folder='client/build', static_url_path='/')
load_dotenv()
app.secret_key = os.environ.get("FLASK_APP_SECRET_KEY")

# API route
@app.route("/login_user", methods=['POST'])
def login_user():
    print("RUNNING LOGIN_USER ROUTE")
    user = request.json.get('user')
    session['user'] = user
    add_user_to_database(user)
    return jsonify({"user": session['user']})

@app.route("/get_logged_in_user", methods=['GET'])
def get_logged_in_user():
    print("RUNNING GET_LOGGED_IN_USER ROUTE")
    if 'user' in session:
        return jsonify({'user': session['user']})
    else:
        return jsonify({'error': 'No Logged In User'})

@app.route("/get_user_profiles", methods=["GET"])
def get_user_profiles_callback():
    print("RETURNING THE USER's PROFILES")
    user_profiles = get_user_profiles(session['user']['sub']).to_json(orient='records', default_handler=str)
    return user_profiles

@app.route("/logout", methods=['GET'])
def logout_user():
    session.clear()
    return jsonify({"message": "Logged Out"})

@app.route('/add_profile', methods=['POST'])
def add_profile():
    profile_json = request.json.get('profile')
    add_profile_to_database(profile_json, session['user']['sub'])
    return jsonify({"message": "Profile added"})

@app.route('/delete_profile', methods=['POST'])
def delete_profile():
    profile_id = request.json.get('profile_id')
    print(f"DELETING USER PROFILE with profile_id = {profile_id}")
    delete_profile_from_database(profile_id, session['user']['sub'])
    return jsonify({"message": "Profile deleted"})

@app.route('/delete_scenario', methods=['POST'])
def delete_scenario():
    scenario_id = request.json.get('scenario_id')
    print(f"DELETING SCENARIO WITH ID = {scenario_id}")
    delete_scenario_from_database(scenario_id=scenario_id, user_sub=session['user']['sub'])
    return jsonify({"message": "Scenario deleted"})


@app.route('/edit_profile', methods=['POST'])
def edit_profile():
    profile_json = request.json.get('profile')
    print("EDITING PROFILE")
    print(profile_json)
    edit_user_profile(profile_json)
    return jsonify({"message": "Profile updated"})

@app.route('/create_scenario', methods=['POST'])
def create_scenario():
    scenario_json = request.json.get('scenario')
    add_scenario_to_database(scenario_json=scenario_json, user_sub=session['user']['sub'])
    return jsonify({"message": "Scenario Uploaded"})

@app.route('/send_messages_to_api', methods=['POST'])
def send_messages_to_api():
    details = request.json.get('details')

    print("/send_messages_to_api called")
    (chat, next_user) = generate_chat_from_details(details)
    responses = generate_responses_from_chat(chat, next_user)

    return jsonify(responses)

@app.route('/get_scenarios', methods=['GET'])
def get_scenarios():
    print()
    scenario_list_json = get_scenario_list(session['user']['sub']).to_json(orient='records', default_handler=str)
    return scenario_list_json

@app.route('/edit_scenario_settings', methods=['POST'])
def edit_scenario_settings():
    scenario_json = request.json.get('scenario')
    edit_scenario_settings_from_json(scenario_json)
    return jsonify({ 'message' : 'Scenario Settings Edited'})

@app.route('/get_scenario_content', methods=['POST'])
def get_scenario_content():
    print("GETTING SCENARIO CONTENT ROUTE")
    scenario_id = request.json.get('scenario_id')

    scenario_contents = get_scenario_from_ids(scenario_id=scenario_id, user_sub=session['user']['sub'])
    print("SCENARIO CONTENTS:")
    print(scenario_contents)

    return jsonify({ 'scenario' : scenario_contents.to_json(orient='records') });

@app.route('/get_profile_name', methods=['POST'])
def get_profile_name():
    profile_id = request.json.get('profile_id')
    query = f"""
        SELECT
            name
        FROM
            profiles
        WHERE
            profile_id = '{profile_id}'
            AND user_sub = '{session['user']['sub']}'
        LIMIT 1;
    """
    profile_name = execute_query(query)['name'][0]
    print("PROFILE NAME DF CALLED")
    return jsonify({ 'profile_name' : profile_name})


@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == "__main__":

    host = 'localhost'
    port = 3000

    if 'DYNO' in os.environ:
        # If we're running in heroku
        host = '0.0.0.0'
        port = 5000

    app.run(host=host, port=port, debug=True)
