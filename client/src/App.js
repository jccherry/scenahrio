import './App.css';
import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'

import SidebarItem from './SidebarItem';
import DisplayProfiles from './DisplayProfiles';
import Scenarios from './Scenarios';
import ProfileDropdownMenu from './ProfileDropdownMenu';

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
            <img src={user.picture}></img>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        }
        {isUserLoggedIn() &&
          <button onClick={() => handleSignOut()}>Sign Out</button>
        }
      </>
    );
  }

  const [selectedObject, setSelectedObject] = useState(null);

  const [selectedComponent, setSelectedComponent] = useState(
    <></>
  );

  const renderComponent = (component) => {
    setSelectedComponent(component);
  };

  return (
    <>
      <div className="App">
        <div className="Header">
          <div className="titleDiv">Scenahr.io</div>
        </div>
        <div class="Main">
          <div class="Sidebar">
            <div class="SidebarContent">
              <UserProfile />
              <SidebarItem label="Employee Profiles" onClick={() => renderComponent(<DisplayProfiles />)} />
              <SidebarItem label="Scenarios" onClick={() => renderComponent(<Scenarios />)} />
            </div>
          </div>
          <div class="Content">
            { true &&
              <>
              <ProfileDropdownMenu profileSelectionHandler={(object) => {setSelectedObject(object);}} />
              {selectedObject &&
                <div>
                  <p><b>Name: </b>{selectedObject.name}</p>
                  <p><b>Age: </b>{selectedObject.age}</p>
                  <p><b>Years Experience: </b>{selectedObject.years_experience}</p>
                  <p><b>Job Title: </b>{selectedObject.job_title}</p>
                </div>
              }
              </>
            }
            {isUserLoggedIn() ? (
              <>
                {selectedComponent}
              </>
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
