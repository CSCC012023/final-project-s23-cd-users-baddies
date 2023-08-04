const admin = require('firebase-admin');

const serviceAccount = require('./cd-user-baddies-firebase-adminsdk-wi45w-d3acb39e81.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cd-user-baddies.firebaseio.com'
});

const db = admin.firestore();

module.exports = { db, firebaseAdmin: admin };

