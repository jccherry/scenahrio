from flask import Flask, session, request, jsonify
from python_modules.db_utils import add_user_to_database
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
    
@app.route("/logout", methods=['GET'])
def logout_user():
    session.clear()
    return jsonify({"message" : "Logged Out"})

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
