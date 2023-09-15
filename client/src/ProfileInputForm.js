import EditForm from "./EditForm";

function ProfileInputForm() {

    return (
        <>
        <EditForm header_text="Profile Input" formAttributes={['Name', 'Age', 'Gender', 'Job Title', 'Years Experience', 'Notes']} />
        </>
    );
}

export default ProfileInputForm;