const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

var serviceAccount = require("../admin.json");

initializeApp(
    {
        credential: cert(serviceAccount),
        databaseURL: "https://cd-user-baddies.firebaseio.com",
    }
);

const db = getFirestore();



module.exports = { db }