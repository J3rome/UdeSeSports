var gameParser = require('./gameParser.js'),
    manager = require('./manager.js'),
    router = require('./router.js'),
    helpers = require('./helpers.js');

module.exports = function(request,response){
    var toCall = router.handleUri(request.url);

    if(toCall){
        handler[toCall](request,response);
    }else{
        handleInvalidUri(request,response);
    }

/*
    var key = uri.substring(1);
    if(key.indexOf('/') != -1){
        key = key.substring(0,key.indexOf('/'));
    }
    var data={};
    if(request.method == 'PUT'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });

        request.on('end', function(){
            if(body == ''){
                data = {
                        'error': 'NO_PARAM',
                        'message': 'The request contain no parameter, please provide firstNumber And secondNumber.'
                    };
                statusCode = 400;
                response.writeHead(statusCode, { 'Content-Type': 'application/json'});
                response.write(JSON.stringify(data));
                response.end();
            }else{
                db.put('main',key,body,function(err){
                    if(err){
                        data = err;
                        statusCode = 400;
                    }else{
                        data = {
                                'action': 'INSERT',
                                'message': 'Insertion of key \''+key+'\' successful.'
                            };
                    }
                    response.writeHead(statusCode, { 'Content-Type': 'application/json'});
                    response.write(JSON.stringify(data));
                    response.end();
                });
            }
        });
    }else if(request.method == 'GET'){
        /*db.get('main', key, function(err,value){
            if(err){
                data = JSON.stringify(err);
                statusCode = 400;
            }else{
                data = value;
            }
            response.writeHead(statusCode, { 'Content-Type': 'application/json'});
            response.write(data);
            response.end();
        });*/
/*    }else if(request.method == 'DELETE'){
        db.delete('main',key,function(err){
            if(err){
                data = err;
                statusCode = 400;
            }else{
                data = {
                    'action': 'DELETE',
                    'message': 'Key \''+key+'\' was deleted successfully.'
                };
            }
            response.writeHead(statusCode, { 'Content-Type': 'application/json'});
            response.write(JSON.stringify(data));
            response.end();
        });
    }else if(request.method == 'POST'){



        /*var body = '';
        request.on('data', function(data){
            body += data;
        });

        request.on('end', function(){
            if(body == ''){
                data = {
                        'error': 'NO_PARAM',
                        'message': 'The request contain no parameter, please provide firstNumber And secondNumber.'
                    };
                statusCode = 400;
                response.writeHead(statusCode, { 'Content-Type': 'application/json'});
                response.write(JSON.stringify(data));
                response.end();
            }else{
                response.writeHead(statusCode, { 'Content-Type': 'application/json'});
                response.write(JSON.stringify(gameParser.getGameInfos(JSON.parse(body))));
                response.end();
            }
        });*/
/*    }else{
        data = {
            'error' : 'INVALID_REQUEST',
            'message': 'This api only accept POST request of type x-www-form-urlencoded.'
        };
        statusCode = 400;
        response.writeHead(statusCode, { 'Content-Type': 'application/json'});
        response.write(JSON.stringify(data));
        response.end();
    }*/
}

var handler = {
    handleTeams: function(request,response){
        var uri = helpers.getSplittedUri(request.url),
            statusCode = 200;

        if(request.method == 'PUT'){
            if(uri.length == 1){
                var body = '';
                request.on('data', function(data){
                    body += data;
                });

                request.on('end', function(){
                    if(body == ''){
                        data = {
                                'error': 'NO_PARAM',
                                'message': 'The request contain no parameter, please provide a team name and a list of players id.'
                            };
                        statusCode = 400;
                        writeJson(response, JSON.stringify(data), statusCode);
                    }else{
                        manager.createTeam(JSON.parse(body), function(err,team){
                            if(err){
                                data = {
                                        'error': 'ERROR',
                                        'message': err
                                    };
                                statusCode = 400;
                                writeJson(response, JSON.stringify(data), statusCode);
                            }else{
                                data = {
                                        'action': 'CREATE_TEAM',
                                        'status': 'SUCCESS',
                                        'teamName': team.name,
                                        'teamId': team.id
                                };
                                writeJson(response, JSON.stringify(data), statusCode);
                            }
                        });
                    }
                });
            }else {
                handleInvalidUri(request,response);
            }
        }else if(request.method == 'GET'){
            if(uri.length == 2){
                manager.getTeam(uri[1],function(err,value){
                    if(err){
                        data = JSON.stringify({
                            'error':err.type,
                            'message':err.toString()
                        });
                        statusCode = 400;
                    }else{
                        data = value;
                    }
                    writeJson(response, data, statusCode);
                });
            }else{
                handleInvalidUri(request,response);
            }
        }
    },
    handlePlayers: function(request,response){
        var statusCode = 200;
        handleInvalidUri(request,response);
    },

    handleMatches: function(request,response){
        var statusCode = 200;
        handleInvalidUri(request,response);
    }
}

function handleInvalidUri(request,response){
    var statusCode = 400;
    data = {
        'error': 'INVALID_URI',
        'message': 'The requested uri('+request.url+') is not available. Please provide valid uri.'
    };
    writeJson(response,JSON.stringify(data),statusCode);
}


// Helpers
function writeJson(response, data, statusCode){
    response.writeHead(statusCode, { 'Content-Type': 'application/json'});
    response.write(data);
    response.end();
}
