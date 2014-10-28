//underscore
var http = require("http"),
    levelup= require("levelup",{'keyEncoding':'string','valueEncoding':'json'}),
    url= require("url"),
    db = levelup("./testDb"),
    port = 8085,
    statusCode=200;
    
var server = http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var key = uri.substring(1);
    if(key.indexOf("/") != -1){
        key = key.substring(0,key.indexOf("/"));
    }
    var data={};
    if(request.method == "PUT"){
        var body = "";
        request.on('data', function(data){
            body += data;
        });
        
        request.on('end', function(){
            if(body == ""){
                data = {
                        "error": "NO_PARAM",
                        "message": "The request contain no parameter, please provide firstNumber And secondNumber."
                        };
                statusCode = 400;
                response.writeHead(statusCode, { 'Content-Type': 'application/json'});
                response.write(JSON.stringify(data));
                response.end();
            }else{
                db.put(key,body, function(err){
                    if(err){
                        data = {
                            "error": "INVALID_BODY",
                            "message": "The body of the request is invalid."
                        };
                        statusCode = 400;
                    }else{
                        data = {
                            "action": "INSERT",
                            "message": "Insertion of key '"+key+"' successful."
                        };
                        console.log("Key '"+key+"' inserted");
                    }
                    response.writeHead(statusCode, { 'Content-Type': 'application/json'});
                    response.write(JSON.stringify(data));
                    response.end();
                });
            }
            
        });
    }else if(request.method == "GET"){
        db.get(key, function(err, value){
                        if(err){
                            data = JSON.stringify({
                                "error": "INVALID_KEY",
                                "message": "The key is invalid."
                            });
                            statusCode = 400;
                        }else{
                            data = value;
                        }
                        response.writeHead(statusCode, { 'Content-Type': 'application/json'});
                        response.write(data);
                        response.end();
        });
        
    }else if(request.method == "DELETE"){
        db.del(key,function(err){
            if(err){
                data = {
                    "error": "INVALID_KEY",
                    "message": "The key is invalid."
                };
                statusCode = 400;
            }else{
                data = {
                    "action": "DELETE",
                    "message": "Key '"+key+"' was deleted successfully."
                };
                console.log("Key '"+key+"' deleted");
            }
            response.writeHead(statusCode, { 'Content-Type': 'application/json'});
            response.write(JSON.stringify(data));
            response.end();
        });
    }else{
        data = {
            "error" : "INVALID_REQUEST",
            "message": "This api only accept POST request of type x-www-form-urlencoded."
        };
        statusCode = 400;
        response.writeHead(statusCode, { 'Content-Type': 'application/json'});
        response.write(JSON.stringify(data));
        response.end();
    } 
    
  
}).listen(parseInt(port, 10));

server.on('close', function(){
    console.log('Close connection to Db');
    db.close();
});

console.log("LevelDb Testing - Running on port "+port);


