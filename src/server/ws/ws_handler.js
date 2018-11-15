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

            const userId = Tokens.consumeToken(token);
            if(userId === null || userId === undefined){
                socket.emit("update", {error: "Invalid token"});
                return;
            }

            ActivePlayers.registerSocket(socket, userId);
            console.log("User '"+userId+"' is now connected with a websocket.");
        });

        //disconnect is treated specially
        socket.on('disconnect',  () => {

          const userId = ActivePlayers.getUser(socket.id);
          if (PlayerQueue.getOrganizer() === userId) {
            let queue = PlayerQueue.getQueue();
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
            let possibleToStart = PlayerQueue.size() > 1;
            let queue = PlayerQueue.getQueue();
            if (queue) {
              queue.forEach((user) => {
                console.log("emiting disconnect by user");
                const socket = ActivePlayers.getSocket(user);
                socket.emit("readyToStart", {
                  canStart: possibleToStart,
                  playerCount: PlayerQueue.size()
                });
              });
            }
          }

          ActivePlayers.removeSocket(socket.id);
          OngoingMatches.forfeit(userId);
          console.log("User '"+userId+"' is disconnected.");
        });
    });
};


module.exports = {start};