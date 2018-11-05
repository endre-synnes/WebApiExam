const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const path = require('path');
const cors = require('cors');
const mongoose = require("mongoose");
const morgan = require('morgan');
require("./config/passport");
const authRoute = require("./routes/auth");
const gameRoute = require("./routes/game-route");
const quizSetup = require("./db/QuizSetup");

const app = express();

//Used for server logging
//app.use(morgan("combined"));

// Connecting to database
const mongoURI = require("./config/keys").mongoURI;
mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//TODO implement so this does not call every time
quizSetup.createQuizzesFromDefaultData();
/*
    We use an environment variable to decide if allowing all origins
    or not
 */
if(process.env.CORS){
    console.log("Using CORS to allow all origins");
    app.use(cors());

    /*
        Even if we allow requests from all origins with
        "Access-Control-Allow-Origin: *"
        (which is what cors() does), it would still block
        requests with authentication (ie cookies).
        Ie, cannot use wildcard * when dealing with authenticated
        requests. We would have to explicitly state the origin (host + port),
        eg, as we did in previous examples:

        app.use(cors({
            origin: 'http://localhost:1234'
        }));
     */
}

//to handle JSON payloads
app.use(bodyParser.json());

/*
    As we are going to use session-based authentication with
    cookies, we need to tell Express to create new sessions.
    The cookie will store user info, encrypted.
 */
app.use(session({
    secret: 'a secret used to encrypt the session cookies',
    resave: false,
    saveUninitialized: false
}));

//needed to server static files, like HTML, CSS and JS.
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

//--- Routes -----------
app.use('/', authRoute);
app.use('/', gameRoute);

//handling 404
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = app;
