# chat_session.py

import os
import openai

system_prompt = f"You are HR-GPT, a Human Resources Simulation AI. Your role is to provide HR users with predictions and suggestions " \
                f"on how to respond to potential recruitment targets or employees. Responses from HR will be labeled 'HR' and responses " \
                f"from others will be labeled with their name."

# from a details dictionary, generate input for the openAI API
def generate_chat_from_details(details, num_responses = 3, num_words = 20):
    print("generate_chat_from_details called!")

    print(details)

    # Create a blank array which will contain our messages
    messages = []

    # add in the system prompt
    messages.append({'role' : 'system', 'content' : system_prompt})

    # Add in some content about the employee
    messages.append({'role' : 'system' , 'content' : f"""
Employee Profile:
```
Name: {details['profile_name']}
Age: {details['profile_age']}
Gender: {details['profile_gender']}
Job Title: {details['profile_job_title']}
Salary: {details['profile_salary']}
Notes: {details['profile_notes']}
```"""})
    # some context about the scenario:
    messages.append({ 'role' : 'system', 'content' : f"Context: {details['context']}"})
    
    last_user_spoke = 'HR'

    for message in details['messages']:
        last_user_spoke = message['user']
        messages.append({
            'role' : 'user'
            , 'content' : f"{message['user']}: '{message['message']}'"
        })
    
    next_user_spoke = details['profile_name'] if last_user_spoke == 'HR' else 'HR'

    # Guidance at the end to make the system give good output
    messages.append({ 'role' : 'system', 
                     'content' : f"""HR's desired outcome is to: {details['desired_outcome']}
Use all knowledge about the employee's profile, notes, context, and HR's desired outcome to simulate realistic possible responses.
Generate {num_responses} possible responses to continue the conversation, each with {num_words} words or less.
Respond as {next_user_spoke}.
Include at least one positive follow up, at least one negative follow up, and at least one neutral follow up, without labeling them as such.
Provide output as a python list. Output must be parse-able with python\'s ast.literal_eval() and nothing else, such as ["Let\'s go.", "Don\'t fire me.", "I\'m excited!"].
"""})

    return messages

def generate_responses_from_chat(chat):
    openai.api_key = os.getenv('OPENAI_API_KEY')

    print('generate_responses_from_chat called!')
    print(f'os.getenv(OPENAI_API_KEY) = {os.getenv("OPENAI_API_KEY")}')
    print(chat)

    response = openai.ChatCompletion.create(model='gpt-3.5-turbo', messages=chat)

    print(response)

    return {'A': 'B', 'C' : 'D', 'E' : 'Babbaooey'}