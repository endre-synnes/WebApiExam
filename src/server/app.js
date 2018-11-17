const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const path = require('path');
const cors = require('cors');
const mongoose = require("mongoose");
require("./config/passport");
const authRoute = require("./routes/auth");
const gameRoute = require("./routes/game-route");
const quizSetup = require("./db/QuizSetup");

const app = express();

const mongoURI = require("./config/keys").mongoURI;
mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

quizSetup.createQuizzesFromDefaultData();

if(process.env.CORS){
    console.log("Using CORS to allow all origins");
    app.use(cors());
}

app.use(bodyParser.json());

app.use(session({
    secret: 'a secret used to encrypt the session cookies',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoute);
app.use('/', gameRoute);

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = app;
