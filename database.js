const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('profiles');
const profileCollection = db.collection('user');
const dbm = client.db('messages');
const messageCollection = dbm.collection('messageChain');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});


async function addUser(user) {
  const result = await profileCollection.insertOne(user);
  return result;
}


function getUserProfile() {
  const cursor = profileCollection.find();
  return cursor.toArray();
}

async function addMessage(sender,  receiver, message){
  //create a key
  let key = [sender, receiver].sort().join('-');
  let result;

  const conversation = await messageCollection.findOne({ key: key });
  

  if (!conversation) {
    result = await messageCollection.insertOne({ key: key, messages: [] });
  }
  await messageCollection.updateOne(
    { key: key },
    { $push: { messages: { sender: sender, message: message } } }
  );
  return result;
}

async function getMessages(user1, user2) {
  // Create a unique key for the conversation
  let key = [user1, user2].sort().join('-');


  // Get the conversation from the database
  const conversation = await messageCollection.findOne({ key: key });

  // If the conversation exists, return the messages
  if (conversation) {
    return JSON.stringify(conversation.messages);
  } else {
    // If the conversation doesn't exist, return an empty array
    return JSON.stringify([]);
  }
}
module.exports = { addUser, getUserProfile, addMessage,getMessages };