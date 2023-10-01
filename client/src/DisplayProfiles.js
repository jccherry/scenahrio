import React, { useEffect, useState } from 'react';
import EditableForm from './EditableForm';

function UserProfile({ profile, refreshFunction }) {
  const [expanded, setExpanded] = useState(false)

  function deleteUserProfile() {
    fetch('/delete_profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile_id: profile.profile_id }),
    }).then(response => response.json())
      .then(response => { console.log(response); refreshFunction() });
  }

  function saveProfile() {
    console.log(profile);

    fetch('/edit_profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile: profile })
    }).then(response => response.json())
      .then(response => { console.log(response); refreshFunction() });
  }

  return (
    <div className='profileCell'>
      <div className='profileHeader'>
        <div className='profileName'>{profile.name}</div>
        <div className='buttonContainer'>
          {expanded ?
            <>
              <button className='expandButton' onClick={() => { saveProfile(); setExpanded(!expanded); }}>Save</button>
              <button className='deleteButton' onClick={() => { setExpanded(false); deleteUserProfile(); }}>Delete</button>
            </>
            :
            <button className='expandButton' onClick={() => { setExpanded(!expanded) }}>Edit</button>
          }
        </div>
      </div>
      {expanded ?
        <div className='profileExpanded'>
          <EditableForm
            formDict={{
              'Name': profile.name
              , 'Age': profile.age
              , 'Gender': profile.gender
              , 'Job Title': profile.job_title
              , 'Years Experience': profile.years_experience
              , 'Notes': profile.notes
            }}
            saveFunction={(updatedDict) => {
              profile.name = updatedDict['Name']
              profile.age = updatedDict['Age']
              profile.gender = updatedDict['Gender']
              profile.job_title = updatedDict['Job Title']
              profile.years_experience = updatedDict['Years Experience']
              profile.notes = updatedDict['Notes']
            }}
          />
        </div>
        : <></>
      }
    </div>
  );
}

function UserProfileList() {
  const [userProfiles, setUserProfiles] = useState([]);
  const [addingNewProfile, setAddingNewProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({})

  // Define a function to fetch user profiles from the API
  const fetchUserProfiles = async () => {
    try {
      const response = await fetch('/get_user_profiles');
      if (!response.ok) {
        throw new Error('Failed to fetch user profiles');
      }
      const data = await response.json();
      setUserProfiles(data);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  };

  function sendProfileToServer(profile) {
    fetch('/add_profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile: profile }),
    }).then(response => response.json())
      .then(message => { console.log(message.message) })
      .then(() => {fetchUserProfiles()});
  }

  useEffect(() => {
    // Call the fetchUserProfiles function to make the API request
    fetchUserProfiles();
  }, []);

  function addProfile() {
    setNewProfile({
      'Name': null
      , 'Age': null
      , 'Gender': null
      , 'Job Title': null
      , 'Years Experience': null
      , 'Notes': null
    });
    setAddingNewProfile(true);
  }

  return (
    <div className='userProfilesPage'>
      <div className='userProfilesHeader'>
        <h1 className='userProfilesHeading'>Employee Profiles</h1>
        <button className='addProfileButton' onClick={() => addProfile()}>+</button>
      </div>
      {addingNewProfile ?
        <div className='profileCell'>
          <EditableForm
            header={
              <div className='profileHeader'>
                <h3><i>New Employee Profile</i></h3>
                <div className='buttonContainer'>
                  <button className='expandButton' onClick={() => { sendProfileToServer(newProfile); setAddingNewProfile(false); }}>Save</button>
                  <button className='deleteButton' onClick={() => { setAddingNewProfile(false); }}>Cancel</button>
                </div>
              </div>
            }
            formDict={newProfile}
            saveFunction={(updatedDict) => {
              setNewProfile(updatedDict);
            }}
            initialVisibility={true}
            autosave={true}
          />
        </div>
        :
        <></>}
      {userProfiles.map((profile, index) => (
        <UserProfile profile={profile} refreshFunction={() => fetchUserProfiles()} />
      ))}
    </div>
  );
}

export default UserProfileList;
