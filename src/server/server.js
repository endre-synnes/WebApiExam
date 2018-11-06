const app = require("./app");
const port = 8080;
const WsHandler = require('./ws/ws_handler');
const server = require('http').Server(app);
WsHandler.start(server);

app.listen(port, () => {
    console.log('Starting server on port ' + port);
});