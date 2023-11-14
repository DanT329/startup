const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('profiles');
const scoreCollection = db.collection('user');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});


async function addUser(user) {
  const result = await scoreCollection.insertOne(user);
  return result;
}


function getUserProfile() {
  const cursor = scoreCollection.find();
  return cursor.toArray();
}

module.exports = { addUser, getUserProfile };