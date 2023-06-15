const express = require("express");
const app = express();

const { db } = require('./firebase')

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));


app.get("/", (req, res) => {
    res.send("Hello World");

});

app.get("/users", async (req, res) => {

    let listUsers = []
    const users = db.collection('Users');
    const data = await users.get();
    data.forEach(doc => {
        listUsers.push(doc.data());
        console.log(doc.id, "=>", doc.data());
    });

    res.json(listUsers);

})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


// exports.api = functions.https.onRequest(app);