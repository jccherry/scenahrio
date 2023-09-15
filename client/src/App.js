import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'

//import EditForm from './EditForm';
import ProfileInputForm from './ProfileInputForm';

function App() {
  const [user, setUser] = useState({});

  function handleCallbackResponse(response) {
    //console.log("Encoded JWT ID Token: " + response.credential);
    var userObject = jwt_decode(response.credential);

    fetch('/login_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userObject }), // Send new message as JSON
    }).then(response => response.json())
      .then(user => { setUser(user.user) });
  }

  // Handles signing out of our backend by sending a GET request to log out and
  // subsequently refreshing the window
  function handleSignOut() {
    setUser({});
    fetch("/logout", {
      method: 'GET'
    }).then(response => response.json())
      .then(message => {
        console.log(message);
        window.location.reload();
      });
  }

  // Attempt to initialize google
  function tryInitialize(maxAttempts) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        /* global google */
        google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCallbackResponse
        });
        // If initialization succeeds, return true
        return true;
      } catch (error) {
        attempts++;
        console.log(`Attempt ${attempts} failed. Retrying...`);
      }
    }

    // If all attempts fail, return false
    return false;
  }

  useEffect(() => {
    var currentOrigin = window.location.origin;
    console.log('Current Origin:', currentOrigin);

    var initialize_result = tryInitialize(5);

    if (initialize_result) {
      console.log("Google is initialized")
    } else {
      console.log("Google Initialization Failed")
      window.location.reload()
    }

    // Call the backend to see if there is a currently logged in user
    fetch('/get_logged_in_user')
      .then((response) => {
        if (!response.ok) {
          // Handle non-2xx HTTP status codes (e.g., 401 Unauthorized)
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Check if the response contains an 'error' property
        if (data.error) {
          // Handle the error case
          console.error(data.error);
        } else {
          // Handle the success case where the backend has a user,
          // and use setUser to save it
          console.log(data.user);
          setUser(data.user)
        }
      })
      .catch((error) => {
        // Handle network errors or other exceptions
        console.error('Fetch error:', error);
      });

    // Render the login button
    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {
        theme: "outline",
        size: "large"
      }
    );
  }, []);

  function isUserLoggedIn() {
    return Object.keys(user).length > 0;
  }

  function UserProfile() {
    // if the user has a name, it exists and a user is logged in
    return (
      <>
        <div id='signInDiv'></div>
        {user &&
          <div className='userProfile'>
            <div>
              <img src={user.picture}></img>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
        }
        {isUserLoggedIn() &&
          <button onClick={() => handleSignOut()}>Sign Out</button>
        }
      </>
    );
  }

  // Component which starts with three things: A label


  // Create this function where if you are editing, the display is a <input>, if you are not
  // Editing, the display is a span, and it should have an onChangeFunction which is attached
  // to the <inputs> that updates form variables using setState so that it can save and send
  // to the database with one single callback from one button at some other point.
  function FormInput(isEditing, formKey, onChangeFunction) {
    return (
      <div></div>
    );
  }

  // View that allows a user to input information about an employee and then
  // sends it to the API to get logged into the database
  function EmployeeForm(user) {
    if (user === {}) {
      return <div></div>
    }
  }

  return (
    <>
      <div className="App">
        <div className="Header">
          <div className="titleDiv">Scenahr.io</div>
        </div>
        <div class="Main">
          <div class="Sidebar">
            <UserProfile />
          </div>
          <div class="Content">
            {isUserLoggedIn() ? (
              <ProfileInputForm />
            ) : (
              <div>Please log in to access this content.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
