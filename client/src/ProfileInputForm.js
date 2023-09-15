import EditForm from "./EditForm";

function ProfileInputForm() {

    function sendProfileToServer(profile) {
        fetch('/add_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profile: profile }),
        }).then(response => response.json())
            .then(message => { console.log(message.message) });
    }

    return (
        <>
            <EditForm
                header_text="Profile Input"
                formAttributes={['Name', 'Age', 'Gender', 'Job Title', 'Years Experience', 'Notes']}
                onSubmitFunction={sendProfileToServer}
            />
        </>
    );
}

export default ProfileInputForm;