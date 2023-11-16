const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

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

async function createUser(user) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(user.password, 10);

  const profile = {
    name: user.name,
    time: user.time,
    Type: user.workoutType,
    Experience: user.experienceLevel,
    Rating: user.rating,
    password: passwordHash,
    token: uuid.v4(),
  };
  const result = await profileCollection.insertOne(profile);

  return result;
}

function getUser(name) {
  return profileCollection.findOne({ name: name });
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

async function getUniqueConversations(user) {

  // Create a regex pattern based on the user
  const pattern = new RegExp(`^(${user}-.*|.*-${user})$`);

  // Get all conversations involving the user
  const conversations = await messageCollection.aggregate([
    {
      $match: {
        'key': { "$regex": pattern }
      }
    },
    {
      $unwind: '$messages'
    },
    {
      $match: {
        'key': { "$regex": pattern }
      }
    },
    {
      $group: {
        _id: null,
        keys: { $addToSet: '$key' }
      }
    }
  ]).toArray();

  // If there are no conversations involving the user, return an empty array
  if (conversations.length === 0) {
    return [];
  }

  // Get the unique conversation partners
  let uniqueConversations = [...new Set(conversations[0].keys)];

  // Extract the name of the other user from each key
  uniqueConversations = uniqueConversations.map(key => {
    const users = key.split('-');
    return users[0] === user ? users[1] : users[0];
  });

  return uniqueConversations;
}





module.exports = { addUser, getUserProfile, addMessage,getMessages, getUniqueConversations,createUser,getUser };