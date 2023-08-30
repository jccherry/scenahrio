# Library Imports
from flask import Flask, session, redirect, url_for, render_template, request
import os

# Custom Imports
from MessageNode import MessageNode
from chat_session import ChatSession, User
from filters import normalize_field_name

# Create a Flask web application instance
app = Flask(__name__, static_folder='static')

app.jinja_env.filters['normalize_field_name'] = normalize_field_name

# Set the secret key used for session encryption
app.secret_key = os.getenv('APP_SECRET_KEY')

default_user = User(
    user_type = "Employee"
    , name = "Josiah Crysanthemums" 
    , gender = "Male"
    , age = 35
    , current_salary = 59_000
    , years_experience = 1.5
    , job_title = "Maintenance Technician"
    , notes = "Dislikes his manager; Arrives late a few times a month"
)

# Retrieve the user's unique MessageNode Tree from the user session
def get_message_tree():
    return get_current_chat_session().root_node

def update_message_tree(message_tree):
    #session['message_tree'] = message_tree.to_json()
    current_chat_session = get_current_chat_session()
    current_chat_session.root_node = message_tree
    session['current_chat_session'] = current_chat_session.to_json()

def get_current_user():
    return get_current_chat_session().user

def update_current_user(user: User):
    #session['current_user'] = user.to_json()
    current_chat_session = ChatSession.from_json(session['current_chat_session'])
    current_chat_session.user = user
    session['current_chat_session'] = current_chat_session.to_json()

def get_current_chat_session():
    if not 'current_chat_session' in session:
        user = default_user
        current_chat_session = ChatSession(user, "Retain this person", "I don't like my manager and I want to make more money")
    else:
        current_chat_session = ChatSession.from_json(session['current_chat_session'])
    
    return current_chat_session

def update_current_chat_session(chat_session: ChatSession):
    session['current_chat_session'] = chat_session.to_json()

# Route to test chat Session functionality
@app.route('/get_chat_session', methods=['POST'])
def get_chat_session_callback():
    chat_session = get_current_chat_session()
    print(chat_session)
    chat_session.user.age = chat_session.user.age + 1
    update_current_chat_session(chat_session)

    return redirect(url_for('index'))

# Route to edit a node's message
@app.route('/edit_node/<string:id>', methods=['POST'])
def edit_node(id):
    message_tree = get_message_tree()
    new_message = request.json.get('newMessage')  # Extract new message from JSON

    print(f"NEW MESSAGE: {new_message}")

    clicked_node = message_tree.find_node_by_id(id)
    clicked_node.message = new_message  # Update the node's message

    print(clicked_node)

    update_message_tree(message_tree)  # Update the session with the modified message tree
    return redirect(url_for('index'))  # Redirect to the main page after editing

# Route to reset the user profile
@app.route('/reset_user', methods=['POST'])
def reset_user():
    update_current_user(default_user)
    return redirect(url_for('index'))

# Route to reset the user's tree
@app.route('/reset_tree', methods=['POST'])
def reset_tree():
    current_chat_session = get_current_chat_session()

    print("REsetting tree!")
    print("Exising chat_session:")
    print(current_chat_session)

    current_user = current_chat_session.user

    current_chat_session = ChatSession(
        user = current_user
        , desired_outcome = current_chat_session.desired_outcome
        , initial_input = current_chat_session.initial_input
        , notes = current_chat_session.notes
    )

    current_chat_session.root_node.children = []
    update_current_chat_session(current_chat_session)
    return redirect(url_for('index'))

@app.route('/reset_settings', methods=['POST'])
def reset_chat_session_settings():
    current_chat_session = get_current_chat_session()

    current_chat_session.desired_outcome = "Retain this Employee"
    current_chat_session.notes = None

    update_current_chat_session(current_chat_session)
    return redirect(url_for('index'))

@app.route('/add_node/<string:id>', methods=['POST'])
def add_node(id):

    current_chat_session = get_current_chat_session()
    current_chat_session.current_node = current_chat_session.root_node.find_node_by_id(id)
    current_chat_session.generate_children()

    '''
    message_tree = get_message_tree()
    print(f"message tree: {message_tree}")

    clicked_node = message_tree.find_node_by_id(id)
    print(f"clicked node: {clicked_node}")

    #clicked_node.create_child_nodes(['a','b','c'])

    update_message_tree(message_tree)
    '''

    update_current_chat_session(current_chat_session)

    return redirect(url_for('index'))

@app.route('/delete_node/<string:id>', methods=['POST'])
def delete_node(id):
    message_tree = get_message_tree()

    clicked_node = message_tree.find_node_by_id(id)

    if clicked_node.parent:
        clicked_node.parent.children = tuple(child for child in clicked_node.parent.children if child != clicked_node)

    update_message_tree(message_tree)
    return redirect(url_for('index'))

@app.route('/edit_user_data/<string:id>', methods=['POST'])
def edit_user(id):
    new_user_data = request.json.get('newUserData')

    current_user = get_current_user()
    current_user.set_field(id,new_user_data)
    update_current_user(current_user)

    print(f"USER {id}: {default_user.get_field(id)}")
    print(f"NEW DATA: {new_user_data}")

    return redirect(url_for('index'))

@app.route('/edit_setting_data/<string:id>', methods=['POST'])
def edit_chat_session_settings(id):
    new_setting_data = request.json.get('newSettingData')
    current_chat_session = get_current_chat_session()
    current_chat_session.set_field(id, new_setting_data)

    update_current_chat_session(current_chat_session)

    return redirect(url_for('index'))

@app.route('/')
def index():
    current_chat_session = get_current_chat_session()
    message_tree = current_chat_session.root_node
    user = current_chat_session.user
    return render_template('index.html', root_node = message_tree, user=user, chat_session=current_chat_session)

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5000)