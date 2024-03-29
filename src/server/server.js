const app = require("./app");
const port = process.env.PORT || 8080;
const WsHandler = require('./ws/ws_handler');
const server = require('http').Server(app);
WsHandler.start(server);

server.listen(port, () => {
    console.log('Starting server on port ' + port);
});