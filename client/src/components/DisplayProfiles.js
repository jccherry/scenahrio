import React, { useEffect, useState } from 'react';
import EditableForm from './EditableForm';
import Modal from './Modal';
import ComponentButton from './ComponentButton';

import plus_button from '../assets/images/plus_button.png';
import { ReactComponent as PencilIcon } from '../assets/icons/pencil.svg';
import { ReactComponent as FilledPencilIcon } from '../assets/icons/pencil-fill.svg';
import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg';
import { ReactComponent as FilledTrashIcon } from '../assets/icons/trash-fill.svg';
import { ReactComponent as CheckIcon } from '../assets/icons/check-square.svg';
import { ReactComponent as FilledCheckIcon } from '../assets/icons/check-square-fill.svg';


function UserProfile({ profile, refreshFunction }) {
  const [expanded, setExpanded] = useState(false);

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
              <ComponentButton
                defaultComponent={<TrashIcon className='defaultSvgButton' />}
                hoverComponent={<FilledTrashIcon className='hoveredSvgButton' />}
                onClick={() => { setExpanded(false); deleteUserProfile(); }}
              />
              <ComponentButton
                defaultComponent={<CheckIcon className='defaultSvgButton' />}
                hoverComponent={<FilledCheckIcon className='hoveredSvgButton' />}
                onClick={() => { saveProfile(); setExpanded(!expanded); }}
              />

            </>
            :
            <>
              <ComponentButton
                defaultComponent={<PencilIcon className='defaultSvgButton' />}
                hoverComponent={<FilledPencilIcon className='hoveredSvgButton' />}
                onClick={() => { setExpanded(!expanded) }}
              />
              { //<button className='expandButton' onClick={() => { setExpanded(!expanded) }}>Edit</button> 
              }
            </>
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
  const [newProfile, setNewProfile] = useState({
    'Name': null
    , 'Age': null
    , 'Gender': null
    , 'Job Title': null
    , 'Years Experience': null
    , 'Notes': null
  })

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
      .then(() => { fetchUserProfiles() });
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
    setIsModalOpen(true);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (newProfile !== null && isModalOpen) {
      openModal();
    }
  }, [newProfile]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='userProfilesPage'>
      <div className='userProfilesHeader'>
        <h1 className='userProfilesHeading'>Employee Profiles</h1>
        <button className='addProfileButton' onClick={() => addProfile()}>
          <img src={plus_button} style={{ height: '50%' }}></img>
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} displayCloseButton={false}>
        <div className='profileCell'>
          <EditableForm
            header={
              <div className='profileHeader'>
                <h3>New Employee Profile</h3>
                <div className='buttonContainer'>
                  <button className='expandButton' onClick={() => { sendProfileToServer(newProfile); closeModal(); }}>Save</button>
                  <button className='deleteButton' onClick={() => { closeModal(); }}>Cancel</button>
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
      </Modal>
      {userProfiles.map((profile, index) => (
        <UserProfile profile={profile} refreshFunction={() => fetchUserProfiles()} />
      ))}
    </div>
  );
}

export default UserProfileList;
