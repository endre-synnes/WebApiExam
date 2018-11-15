/*
    INFO:
    This file is inspired by The Web And API design lecture 11.
 */

const socketIo = require('socket.io');
const Tokens = require('./tokens');
const ActivePlayers = require('../service/ActivePlayers');
const OngoingMatches = require('../service/OngoingMatches');
const PlayerQueue = require("../service/PlayerQueue");

let io;

const start = (server) => {

    console.log("setting up web sockets");

    //start a WebSocket server besides the REST API from Express
    io = socketIo(server);

    /*
        Every time a new user connects, a "connect" even is sent to the server,
        and we can obtain the "socket" object associated with such new user.
        On such object, we will register a series of event listeners using
        ".on".
     */
    io.on('connection', function(socket){


        socket.on('login', (data) => {

            if(data === null || data === undefined){
                socket.emit("update", {error: "No payload provided"});
                return;
            }

            const token = data.wstoken;

            if(token === null || token === undefined){
                socket.emit("update", {error: "Missing token"});
                return;
            }

            //token can be used only once to authenticate only a single socket
            const userId = Tokens.consumeToken(token);

            if(userId === null || userId === undefined){
                socket.emit("update", {error: "Invalid token"});
                return;
            }

            /*
                if token was valid, then we can create an authenticated
                association with the given user for that token and the
                current socket
             */
            ActivePlayers.registerSocket(socket, userId);

            console.log("User '"+userId+"' is now connected with a websocket.");
        });

        //disconnect is treated specially
        socket.on('disconnect',  () => {

            const userId = ActivePlayers.getUser(socket.id);

            if (PlayerQueue.getOrganizer() === userId) {
              let queue = PlayerQueue.getQueue();
              console.log("organizer leaving");
              console.log(`queue size: ${queue.length}`);
              queue.forEach( (user) => {
                const socket = ActivePlayers.getSocket(user);
                socket.emit("gameCanceled", {
                  canceled: true ,
                  message : "Organizer left the game."
                });
              });
              PlayerQueue.emptyQueue();
            } else {
              PlayerQueue.removeUser(userId);
            }

            ActivePlayers.removeSocket(socket.id);

            /*
                if a user is leaving, any of its ongoing matches should be
                forfeit, which means that the opponent wins.
                If we do not do this, a user could cheat by just quitting
                the connection when it sees that it is losing a match
             */
            OngoingMatches.forfeit(userId);

            console.log("User '"+userId+"' is disconnected.");
        });
    });
};


module.exports = {start};