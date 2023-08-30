// Attach a callback to the reset user profile button
document.getElementById('reset-user-button').addEventListener('click', () => {
    console.log('reset user')
    fetch(`/reset_user`, { method: 'POST' })
        .then(response => window.location.reload());
});

// Attach listeners to all of the User Form "Edit" buttons that hide the span, display the
// input box with the text of the span, and hide the edit button and unhide the save button
const userFormEditButtons = document.querySelectorAll('.user_data_edit_button');
userFormEditButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');

        // get the span with the label value
        const span_label = document.getElementById(`span_user_${id}`)

        // extract the text content and hide the span
        var label_text = span_label.textContent
        span_label.style.display = 'none'

        // retrieve the hidden input, set the text to be the span text and display it inline
        const user_input = document.getElementById(`user_input_${id}`)
        user_input.value = label_text
        user_input.style.display = 'inline'

        // hide the edit button and display the save button
        button.style.display = 'none'
        const save_button = document.getElementById(`user_save_${id}`)
        save_button.style.display = 'inline'
    });
});

// Attach callbacks to the save buttons in the user profile form that actually update the user data!!!
const userFormSaveButtons = document.querySelectorAll('.user_data_save_button');
userFormSaveButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');

        // retrieve the hidden input, set the text to be the span text and display it inline
        const user_input = document.getElementById(`user_input_${id}`).value;

        console.log(user_input);

        fetch(`/edit_user_data/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newUserData: user_input }), // Send new message as JSON
        }).then(response => window.location.reload()); // Reload the page after editing
    });
});

// Attach listeners to all of the User Form "Edit" buttons that hide the span, display the
// input box with the text of the span, and hide the edit button and unhide the save button
const settingFormEditButtons = document.querySelectorAll('.setting_data_edit_button');
settingFormEditButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');

        console.log(`setting_data_edit_button pressed id = ${id}`)

        // get the span with the label value
        const span_label = document.getElementById(`span_setting_${id}`)

        console.log(span_label)

        // extract the text content and hide the span
        var label_text = span_label.textContent
        span_label.style.display = 'none'

        // retrieve the hidden input, set the text to be the span text and display it inline
        const setting_input = document.getElementById(`setting_input_${id}`)
        setting_input.value = label_text
        setting_input.style.display = 'inline'

        // hide the edit button and display the save button
        button.style.display = 'none'
        const save_button = document.getElementById(`setting_save_${id}`)
        save_button.style.display = 'inline'
    });
});

// Attach callbacks to the save buttons in the setting profile form that actually update the setting data!!!
const settingFormSaveButtons = document.querySelectorAll('.setting_data_save_button');
settingFormSaveButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');

        // retrieve the hidden input, set the text to be the span text and display it inline
        const setting_input = document.getElementById(`setting_input_${id}`).value;

        console.log(setting_input);

        fetch(`/edit_setting_data/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newSettingData: setting_input }), // Send new message as JSON
        }).then(response => window.location.reload()); // Reload the page after editing
    });
});

// Attach a callback to the reset tree/scenario button
document.getElementById('reset-tree-button').addEventListener('click', () => {
    fetch(`/reset_tree`, { method: 'POST' })
        .then(response => window.location.reload());
});

// Attach a callback to the reset settings button
document.getElementById('reset-settings-button').addEventListener('click', () => {
    fetch('/reset_settings', {method: 'POST'})
        .then(response => window.location.reload());
});

// Attach callbacks to all of the generated branch buttons
// This gets a list of every button in the html which has class = "branch_button"
const branchButtons = document.querySelectorAll('.branch_button');
branchButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        // Adds a callback to the python function add_node which takes the ID from the data-id in the HTML
        fetch(`/add_node/${id}`, { method: 'POST' })
            .then(response => window.location.reload());
    });
});

// Attach callbacks to the delete buttons
const deleteButtons = document.querySelectorAll('.delete_node_button');
deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        fetch(`/delete_node/${id}`, { method: 'POST' })
            .then(response => window.location.reload());
    })
})

// Add callback to  the edit node buttons
const editNodeButtons = document.querySelectorAll('.edit_node_button');
editNodeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get the data-id of the button so we know what node to modify
        const id = button.getAttribute('data-id');

        // Get the save_button, node_message, and node_data_input
        const save_button = document.getElementById(`save_node_${id}`);
        const node_message = document.getElementById(`node_message_${id}`);
        const node_data_input = document.getElementById(`node_input_${id}`);

        // Hide the edit button (button that this callback is referring to)
        // and display the save button
        button.style.display = 'none';
        save_button.style.display = 'inline';

        // Hide the node_message and display the input box
        node_message.style.display = 'none';
        node_data_input.style.display = 'inline';

        // give the node_data_input the content of the node_message without having
        // to do anything server-side to get the content
        node_data_input.value = node_message.textContent;
    });
});

// add callbacks to the save node buttons
const saveNodeButtons = document.querySelectorAll('.save_node_button');
saveNodeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get the data-id of the button so we know what node to modify
        const id = button.getAttribute('data-id');

        // Get the edit_button, node_message, and node_data_input
        const edit_button = document.getElementById(`edit_node_${id}`);
        const node_message = document.getElementById(`node_message_${id}`);
        const node_data_input = document.getElementById(`node_input_${id}`);

        // Hide the save button (button that this callback is referring to)
        // and display the edit button
        button.style.display = 'inline';
        edit_button.style.display = 'none';

        // Display the node_message and hide the input box
        node_message.style.display = 'inline';
        node_data_input.style.display = 'none';

        // Get the edited value by grabbing the value of the textarea element
        new_message = node_data_input.value;
        
        // Send the new data to the server
        fetch(`/edit_node/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newMessage: new_message }), // Send new message as JSON
        }).then(response => window.location.reload()); // Reload the page after editing
    });
});