import React, { useEffect, useState } from 'react';

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

  return (
    <div className='profileCell'>
      <div className='profileHeader'>
        <div className='profileName'>{profile.name}</div>
        <div className='buttonContainer'>
          <button className='expandButton' onClick={() => { setExpanded(!expanded) }}>Expand</button>
          <button className='deleteButton' onClick={() => { deleteUserProfile() }}>Delete</button>
        </div>
      </div>
      {expanded ?
        <div className='profileExpanded'>
          <strong>Age:</strong> {profile.age}<br />
          <strong>Gender:</strong> {profile.gender}<br />
          <strong>Job Title:</strong> {profile.job_title}<br />
          <strong>Years of Experience:</strong> {profile.years_experience}<br />
          <strong>Notes:</strong> {profile.notes}<br />
          <br />
        </div> :
        <></>
      }
    </div>
  );
}

function UserProfileList() {
  const [userProfiles, setUserProfiles] = useState([]);

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

  useEffect(() => {
    // Call the fetchUserProfiles function to make the API request
    fetchUserProfiles();
  }, []);

  return (
    <div>
      <h1>User Profiles</h1>
      {userProfiles.map((profile, index) => (
        <UserProfile profile={profile} refreshFunction={() => fetchUserProfiles()} />
      ))}
    </div>
  );
}

export default UserProfileList;
