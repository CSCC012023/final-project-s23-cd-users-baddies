const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

// Setting up root directory to pull files from for routing
app.use(express.static('public'));


// Landing page
app.get("/", (req, res) => {
    res.send("Hello World");
});


// Initializing port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});