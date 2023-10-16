import './App.css';
import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'

// Components
import SidebarItem from './components/SidebarItem';
import DisplayProfiles from './components/DisplayProfiles';
import Scenarios from './components/Scenarios';
import LoginView from './components/LoginView';

// Images
import light_logo from './assets/images/light_logo.png';
import { ReactComponent as OptionIcon } from './assets/icons/option.svg';
import { ReactComponent as PersonVcardIcon } from './assets/icons/person-vcard.svg';
import { ReactComponent as LogoutIcon } from './assets/icons/box-arrow-in-right.svg';


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
        {user &&
          <div className='userProfile'>
            <div className='userDisplay'>
              <img src={user.picture} className='userPicture'></img>
              <div className='userDisplayName'>
                <span className='userDisplayNameSpan'>
                  {user.given_name}
                </span>
                <span className='userDisplayNameSpan'>
                  {user.family_name}
                </span>
              </div>
            </div>
            <SidebarItem
              label="Sign Out"
              onClick={() => handleSignOut()}
              defaultSvg={<LogoutIcon className={'sidebarIconSvg'} />}
              hoverSvg={<LogoutIcon className={'sidebarIconSvg'} />}
            />
          </div>
        }
      </>
    );
  }

  const [selectedComponent, setSelectedComponent] = useState(
    <Scenarios />
  );

  const renderComponent = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="App">
      {!isUserLoggedIn() ?
        <LoginView />
        :
        <div className='appContainer'>
          <div className="Header">
            <div className="titleDiv">
              <img src={light_logo} style={{ height: '100px' }}></img>
            </div>
          </div>
          <div className="Main">
            <div className="Sidebar">
              <div className="SidebarContent">
                <SidebarItem
                  label="Scenarios"
                  onClick={() => renderComponent(<Scenarios />)}
                  defaultSvg={<OptionIcon className={'sidebarIconSvg'} />}
                  hoverSvg={<OptionIcon className={'sidebarIconSvg'} />}
                />
                <SidebarItem
                  label="Profiles"
                  onClick={() => renderComponent(<DisplayProfiles />)}
                  defaultSvg={<PersonVcardIcon className={'sidebarIconSvg'} />}
                  hoverSvg={<PersonVcardIcon className={'sidebarIconSvg'} />}
                />
              </div>
              <div className="SidebarBottom">
                <UserProfile />
              </div>
            </div>
            <div className="Content">
              {isUserLoggedIn() &&
                <>
                  {selectedComponent}
                </>}
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
