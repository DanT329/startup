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

async function addMessage(message){
  const result = await messageCollection.insertOne(message);
}
module.exports = { addUser, getUserProfile };