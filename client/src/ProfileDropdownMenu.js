import React, { useState, useEffect } from 'react'
import ObjectDropdown from './ObjectDropdown';

function ProfileDropdownMenu({
    profileSelectionHandler
}) {
    const [profiles, setProfiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        console.log("PROFILEs UPDATED IN PROFILEDROPDOWNMENU")
        console.log(profiles);
    }, [profiles]);

    // Define a function to fetch user profiles from the API
    const fetchUserProfiles = async () => {
        fetch('/get_user_profiles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then((data) => {
            console.log("User Profiles:");
            console.log(data);
            setProfiles(data);
            setLoading(false);
        }).catch((err) => {
            setLoadError(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        // Call the fetchUserProfiles function to make the API request
        fetchUserProfiles();
    }, []);

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : loadError ? (
                <p>Error: {loadError.message}</p>
            ) : (
                <ObjectDropdown
                    objectList={profiles}
                    displayKey={'name'}
                    onUpdateFunction={(object) => { profileSelectionHandler(object); }}
                    defaultText='Select Profile'
                />
            )}
        </>
    )
}

export default ProfileDropdownMenu
