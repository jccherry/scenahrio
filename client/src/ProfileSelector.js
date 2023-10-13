import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';

function ProfileSelector({
    handleProfileSelection
}) {

    const [profiles, setProfiles] = useState([]);

    // Define a function to fetch user profiles from the API
    const fetchUserProfiles = async () => {
        try {
            const response = await fetch('/get_user_profiles');
            if (!response.ok) {
                throw new Error('Failed to fetch user profiles');
            }
            const data = await response.json();
            setProfiles(data);
        } catch (error) {
            console.error('Error fetching user profiles:', error);
        }
    };

    useEffect(() => {
        // Call the fetchUserProfiles function to make the API request
        fetchUserProfiles();
    }, []);

    return (
        <Dropdown
            defaultText="Select Profile"
            itemList={profiles}
            callbackFunction={(profile) => { handleProfileSelection(profile) }}
            fieldName={"name"}
        />
    );
}

export default ProfileSelector;