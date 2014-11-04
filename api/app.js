//underscore
var http = require("http"),
    httpHandler = require("./src/httpHandler.js"),
    port = 8085,
    statusCode=200;

var server = http.createServer(function(request, response) {
    httpHandler(request,response);
}).listen(parseInt(port, 10));

server.on('close', function(){
    console.log('Close connection to Db');
    db.close();
});

console.log("LevelDb Testing - Running on port "+port);
