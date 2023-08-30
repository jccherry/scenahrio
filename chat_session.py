# chat_session.py
#
# Defines ChatSession and OpenAI API interfacing for scenahr.io

import openai
import ast
import json
import os

from MessageNode import MessageNode

# User class to represent user profiles
class User:
    age_threshold = 40

    def __init__(self, user_type, name=None, gender=None, age=None, current_salary=None, years_experience=None,
                 job_title=None, notes=None):
        self.user_type = user_type
        self.name = name
        self.gender = gender
        self.age = age
        self.current_salary = current_salary
        self.years_experience = years_experience
        self.job_title = job_title
        self.notes = notes

    # Generate a formatted profile string
    def generate_profile(self):
        newline = '\n'
        profile_str = f"{self.user_type} Profile:\n\n"
        profile_str += f"Name: {self.name}{newline}" if self.name is not None else ''
        profile_str += f"Age: {self.age}{newline}" if self.age is not None and self.age < self.age_threshold else ''
        profile_str += f"Gender: {self.gender}{newline}" if self.gender is not None else ''
        profile_str += f"Current Salary: {self.current_salary}{newline}" if self.current_salary is not None else ''
        profile_str += f"Years Experience: {self.years_experience}{newline}" if self.years_experience is not None else ''
        profile_str += f"Job Title: {self.job_title}{newline}" if self.job_title is not None else ''
        profile_str += f"Notes: {self.notes}" if self.notes is not None else ''
        return profile_str
    
    def __repr__(self) -> str:
        return self.generate_profile()
    
    def get_field(self, field_name):
        if field_name == "user_type":
            return self.user_type
        elif field_name == "name":
            return self.name
        elif field_name == "gender":
            return self.gender
        elif field_name == "age":
            return self.age
        elif field_name == "current_salary":
            return self.current_salary
        elif field_name == "years_experience":
            return self.years_experience
        elif field_name == "job_title":
            return self.job_title
        elif field_name == "notes":
            return self.notes
        else:
            return None
        
    def set_field(self, field_name, value):
        if field_name == "user_type":
            self.user_type = value
        elif field_name == "name":
            self.name = value
        elif field_name == "gender":
            self.gender = value
        elif field_name == "age":
            self.age = value
        elif field_name == "current_salary":
            self.current_salary = value
        elif field_name == "years_experience":
            self.years_experience = value
        elif field_name == "job_title":
            self.job_title = value
        elif field_name == "notes":
            self.notes = value

    def to_json(self):
        data = self._user_to_dict()
        return json.dumps(data, indent=2)

    @classmethod
    def from_json(cls, json_str):
        data = json.loads(json_str)
        return cls._user_from_dict(data)

    def _user_to_dict(self):
        return {
            "user_type": self.user_type
            , "name": self.name
            , "gender": self.gender
            , "age": self.age
            , "current_salary": self.current_salary
            , "years_experience": self.years_experience
            , "job_title": self.job_title
            , "notes": self.notes
        }

    @classmethod
    def _user_from_dict(cls, data):
        user = cls(
            user_type = data["user_type"]
            , name = data["name"]
            , gender = data["gender"]
            , age = data["age"]
            , current_salary = data["current_salary"]
            , years_experience = data["years_experience"]
            , job_title = data["job_title"]
            , notes = data["notes"]
        )
        return user

# ChatSession class for managing conversation flow
class ChatSession:
    system_prompt = f"You are HR-GPT, a Human Resources Simulation AI. Your role is to provide HR users with predictions and suggestions " \
                    f"on how to respond to potential recruitment targets or employees. Responses from HR will be labeled 'HR' and responses " \
                    f"from others will be labeled as 'Employee', 'Manager', 'Executive', or 'Recruit'"

    def __init__(self, user: User, desired_outcome, initial_input, system_prompt=None, notes=None, root_node = None):
        self.user = user
        self.desired_outcome = desired_outcome
        if system_prompt is not None:
            self.system_prompt = system_prompt
        self.initial_input = initial_input
        if root_node is None:
            self.root_node = MessageNode(user_type=self.user.user_type, name=self.initial_input)
        else:
            self.root_node = root_node
        self.current_node = self.root_node
        self.notes = notes

        # import the openai api key
        openai.api_key = os.getenv('OPENAI_API_KEY')

        return
    
    def get_field(self, field_name):
        if field_name == "desired_outcome":
            return self.desired_outcome
        elif field_name == "notes":
            return self.notes
        else:
            return None
        
    def set_field(self, field_name, data):
        if field_name == "desired_outcome":
            self.desired_outcome = data
        elif field_name == "notes":
            self.notes = data
        else:
            pass
    
    def to_json(self):
        data = self._chat_session_to_dict()
        return json.dumps(data, indent=2)

    @classmethod
    def from_json(cls, json_str):
        data = json.loads(json_str)
        return cls._chat_session_from_dict(data)

    def _chat_session_to_dict(self):
        return {
            "user" : self.user.to_json()
            , "desired_outcome" : self.desired_outcome
            , "system_prompt" : self.system_prompt
            , "root_node" : self.root_node.to_json()
            , "initial_input" : self.initial_input
            , "notes" : self.notes
        }

    @classmethod
    def _chat_session_from_dict(cls, data):
        chat_session = cls(
            user = User.from_json(data['user'])
            , desired_outcome = data['desired_outcome']
            , system_prompt = data['system_prompt']
            , root_node = MessageNode.from_json(data['root_node'])
            , initial_input = data['initial_input']
            , notes = data['notes']
        )
        return chat_session
    
    # Generate a list of messages for the conversation
    def generate_messages(self, follow_up_user_type=None, num_messages = 3, num_words = 30):
        messages = [
            {"role": "system", "content": self.system_prompt}  # Initial system prompt
            , {"role": "user", "content": f"HR:\n'{self.user.generate_profile()}'"}  # User Profile
            , {"role": "user", "content": f"HR:\n'HR's desired outcome is: {self.desired_outcome}'"}  # Desired outcome
        ]

        # Add some additional context for openAI api if there are "notes" on the scenario
        if self.notes:
            messages = messages + [{"role": "user", "content": f"HR:\n'Here is some added context: {self.notes}'"}]

        # Concatenate all messages up until the root (which is the system prompt, so pop it off)
        root_messages = self.current_node.concatenate_messages_to_root()
        # add in the rest of the conversation
        messages = messages + [{"role" : "user", "content" : message} for message in root_messages]

        if follow_up_user_type == None:
            if self.current_node.root == None:
                # If this is the root node, the first follow up is always HR
                follow_up_user_type = "HR"
            elif self.current_node.user_type == "HR":
                follow_up_user_type = self.user.user_type
            else:
                follow_up_user_type = "HR"
        else:
            pass


        #print(f"follow_up_user_type = {follow_up_user_type}")

        example_output = '["Let\'s go.", "Don\'t fire me.", "I\'m excited!"]'
        prompt = f"Generate {num_messages} possible follow ups from {follow_up_user_type if follow_up_user_type == 'HR' else self.user.name if self.user != None else self.user.user_type}. " \
                 f"Include one positive follow up, one negative follow up, and one neutral follow up, without labeling them as such." \
                 f"Provide output as a python list with {num_words} words or less in each string. \n\n " \
                 f"Output must be parse-able with python's ast.literal_eval() and nothing else, such as {example_output}."

        # Insert the prompt at the end of the messages list
        messages.append({"role": "user", "content": prompt})

        #print("Messages:")
        #print(messages)

        return messages
    
    # Display current scenario and available child options
    def display_child_options(self):
        index = 0

        print("Current Scenario:")
        history = self.current_node.concatenate_messages_to_root()
        history.pop(0)
        history.insert(0, f"{self.user.user_type}: {self.initial_input}")
        for item in history:
            print(item)

        print()

        print("Possible Options:")
        for child in self.current_node.children:
            print(f"{index}: {child.data}")
            index += 1

    # Choose a child option based on the index
    def choose_child_option(self, index):
        if index == -1 and self.current_node.root is not None:
            self.current_node = self.current_node.root
        elif 0 <= index < len(self.current_node.children):
            self.current_node = self.current_node.children[index]

    # Generate child options based on AI response
    def generate_children(self, next_user_type=None, num_messages = 3, num_words = 30):
        messages = self.generate_messages(next_user_type, num_messages=num_messages, num_words=num_words)

        # Debug by printing out every message that gets generated:
        print("\n\nOPENAI CHAT TRANSCRIPT===========================================================")
        for message in messages:
            print("Message=================================")
            print(f"Role: {message['role']}")
            print(f"Content: \n{message['content']}")
        print("OPENAI CHAT TRANSCRIPT===========================================================\n\n")

        response = openai.ChatCompletion.create(model='gpt-3.5-turbo', messages=messages)

        # Process and sanitize the response list string
        list_string = response['choices'][0]['message']['content']
        #list_string = list_string.replace("'m", "\\'m").replace("n't", "n\\'t").replace("'s", "\\'s")

        if self.current_node.root == None:
            # If this is the root, the first follow up always comes from HR
            next_user_type = "HR"
        elif next_user_type is None:
            next_user_type = self.user.user_type if self.current_node.user_type == "HR" else "HR"

        try:
            response_list = ast.literal_eval(list_string)
        except SyntaxError:
            print("Attempting to fix a syntax error in GPT response...")
            # If there is an issue parsing the string, attempt to have GPT repair it:
            fix_messages = [
                {"role": "system", "content": "You are AST-GPT, a syntax repair bot that takes input in the form of a string and repairs it so that it is parseable with python's ast.literal_eval.  In your response, include only fixed strings with no additional context."}  # Initial system prompt
                , {"role": "user", "content": list_string}  # broken string
            ]

            for i in range(3):
                response = openai.ChatCompletion.create(model='gpt-3.5-turbo', messages=fix_messages)
                list_string = response['choices'][0]['message']['content']
                try:
                    response_list = ast.literal_eval(list_string)
                    break
                except SyntaxError:
                    pass

        self.current_node.create_child_nodes(next_user_type=next_user_type, messages_list=response_list)

    def __repr__(self):
                return \
f"""Chat Session:
==============================================================================
User:
{self.user}
MessageTree:
{self.root_node}
==============================================================================
"""