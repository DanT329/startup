let conversations = {};

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

addMessage("John","Smith","hello")
addMessage("John","Smith","goodbye")
addMessage("Smith","John","hello")
console.log(conversations)
