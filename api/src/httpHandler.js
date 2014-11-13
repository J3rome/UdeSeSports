var manager = require('./manager.js'),
    router = require('./router.js'),
    helpers = require('./helpers.js');

module.exports = function(request,response){
    var toCall = router.handleFirstLevelUri(request.url);

    if(toCall){
        firstLevelHandler[toCall](request,response);
    }else{
        handleInvalidUri(request,response);
    }
}

var firstLevelHandler = {
    handleManager: function(request,response){
        var toCall = router.handleManagerUri(request.url);

        if(toCall){
            managerHandler[toCall](request,response);
        }else{
            handleInvalidUri(request,response);
        }
    }
};

var managerHandler = {
    handleTeams: function(request,response){
        var uri = helpers.getSplittedUri(request.url),
            statusCode = 200;

        if(request.method == 'PUT'){
            if(uri.length == 2){
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
            if(uri.length == 3){
                manager.getTeam(uri[2],function(err,value){
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
        }else{
            handleInvalidMethod(request,response);
        }
    },
    handlePlayers: function(request,response){
        var uri = helpers.getSplittedUri(request.url),
            statusCode = 200;

        if(request.method == 'PUT'){
            if(uri.length == 2){
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
                        manager.createPlayer(JSON.parse(body), function(err,player){
                            if(err){
                                data = {
                                    'error': 'ERROR',
                                    'message': err.toString()
                                };
                                statusCode = 400;
                                writeJson(response, JSON.stringify(data), statusCode);
                            }else{
                                manager.getTeamName(player.teamId, function(err,teamName){
                                    if(err){
                                        data = {
                                            'error': 'ERROR',
                                            'message': err.toString()
                                        };
                                        statusCode = 400;
                                        writeJson(response, JSON.stringify(data), statusCode);
                                    }else{
                                        data = {
                                            'action': 'CREATE_PLAYER',
                                            'status': 'SUCCESS',
                                            'playerId': player.id,
                                            'summonerName': player.summonerName,
                                            'teamName': teamName
                                        };
                                        writeJson(response, JSON.stringify(data), statusCode);
                                    }
                                });
                            }
                        });
                    }
                });
            }else {
                handleInvalidUri(request,response);
            }
        }else if(request.method == 'GET'){
            if(uri.length == 3){
                manager.getPlayer(uri[2],function(err,value){
                    if(err){
                        data = JSON.stringify({
                            'error':err.type,
                            'message':err.toString()
                        });
                        statusCode = 400;
                    }else{
                        data = JSON.stringify(value);
                    }
                    writeJson(response, data, statusCode);
                });
            }else{
                handleInvalidUri(request,response);
            }
        }else{
            handleInvalidMethod(request,response);
        }
    },

    handleMatches: function(request,response){
        var uri = helpers.getSplittedUri(request.url),
            statusCode = 200;

        if(request.method == 'POST'){
            if(uri.length == 2){
                var body = '';
                request.on('data', function(data){
                    body += data;
                });

                request.on('end', function(){
                    if(body != ''){
                        // TODO: Add error handling if body of the request is invalid
                        manager.saveMatche(JSON.parse(body), function(err,matche){
                            // TODO: Remove the returned data since the http request will be done automatically by League servers
                            if(err){
                                data = {
                                    'error':err.type,
                                    'message':err.toString()
                                };
                                statusCode = 400;
                            }else{
                                data = {
                                    'action': 'SAVE_MATCHE',
                                    'status': 'SUCCESS',
                                    'matcheId': matche.id
                                };
                            }
                            writeJson(response, JSON.stringify(data), statusCode);
                        });
                    }else{
                        handleInvalidBody(request,response);
                    }
                });
            }else{
                handleInvalidUri(request,response);
            }
        }else if(request.method == 'GET'){
            if(uri.length == 3){
                manager.getMatche(uri[2],function(err,value){
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
        }else{
            handleInvalidMethod(request,response);
        }

    }
}

// Error handling
function handleInvalidUri(request,response){
    var statusCode = 400;
    data = {
        'error': 'INVALID_URI',
        'message': 'The requested uri('+request.url+') is not available. Please provide valid uri.'
    };
    writeJson(response,JSON.stringify(data),statusCode);
}

function handleInvalidMethod(request,response){
    var statusCode = 400;
    data = {
        'error': 'INVALID_METHOD',
        'message': request.method + ' requests are not allowed on this uri.'
    };
    writeJson(response,JSON.stringify(data),statusCode);
}

function handleInvalidBody(request,response){
    var statusCode = 400;
    data = {
        'error': 'INVALID_BODY',
        'message': 'The body of the requests is invalid.'
    };
    writeJson(response,JSON.stringify(data),statusCode);
}

// Helpers
function writeJson(response, data, statusCode){
    response.writeHead(statusCode, { 'Content-Type': 'application/json'});
    response.write(data);
    response.end();
}
