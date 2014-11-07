var http = require("http"),
    httpHandler = require("./src/httpHandler.js"),
    port = 8085;

module.exports.init = function(){
    var server = http.createServer(function(request, response) {
        httpHandler(request,response);
    }).listen(parseInt(port, 10));


    // TODO: Verify if this does what it is supossed to do
    server.on('close', function(){
        console.log('Close connection to Db');
        db.close();
    });

    console.log("LevelDb Testing - Running on port "+port);
}

module.exports.init();
