// Define the conversations object
let conversations = {};

// Define the addMessage function
function addMessage(sender, receiver, message) {
    // Create a unique key for the conversation
    let key = [sender, receiver].sort().join('-');

    // If the conversation doesn't exist, create it
    if (!conversations[key]) {
        conversations[key] = [];
    }

    // Append the message to the conversation
    conversations[key].push({ sender: sender, message: message });
}

// Define the getUniqueConversations function
function getUniqueConversations(user) {
    // Initialize an empty array to hold the unique conversation partners
    let uniqueConversations = [];

    // Iterate over each conversation
    for (let key in conversations) {
        // Split the key into the two usernames
        let users = key.split('-');

        // Check if the given user is part of the conversation
        if (users.includes(user)) {
            // Find the other user in the conversation
            let otherUser = users[0] === user ? users[1] : users[0];

            // Add the other user to the array if they're not already in it
            if (!uniqueConversations.includes(otherUser)) {
                uniqueConversations.push(otherUser);
            }
        }
    }

    // Return the array of unique conversation partners
    return uniqueConversations;
}

// Add some test messages
addMessage('Alice', 'Bob', 'Hello Bob!');
addMessage('Bob', 'Alice', 'Hi Alice!');
addMessage('Alice', 'Charlie', 'Hey Charlie!');
addMessage('Charlie', 'Alice', 'Hello Alice!');
addMessage('Bob', 'Charlie', 'Hi Charlie!');
addMessage('Charlie', 'Bob', 'Hello Bob!');

// Print out the list of unique conversation partners for Alice
console.log(getUniqueConversations('Alice'));

// Print out the list of unique conversation partners for Bob
console.log(getUniqueConversations('Bob'));
