from flask import Flask, session, request, jsonify
from python_modules.db_utils import *
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
        return jsonify({'user': session['user'] })
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
    return jsonify({"message" : "Logged Out"})

@app.route('/add_profile', methods=['POST'])
def add_profile():
    profile_json = request.json.get('profile')
    add_profile_to_database(profile_json, session['user']['sub'])

    return jsonify({"message" : "Profile added"})

@app.route('/delete_profile', methods=['POST'])
def delete_profile():
    profile_id = request.json.get('profile_id')
    print(f"DELETING USER PROFILE with profile_id = {profile_id}")
    delete_profile_from_database(profile_id)
    return jsonify({"message": "Profile deleted"})

@app.route('/edit_profile', methods=['POST'])
def edit_profile():
    profile_json = request.json.get('profile')
    print("EDITING PROFILE")
    print(profile_json)
    edit_user_profile(profile_json)
    return jsonify({"message": "Profile updated"})

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

    app.run(host=host
            , port=port
            , debug=True)
