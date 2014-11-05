var url= require('url'),
    gameParser = require('./gameParser.js'),
    manager = require('./manager.js');

module.exports = function(request,response){
    var statusCode = 200;
    var uri = url.parse(request.url).pathname;
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
        manager.getTeam(key,function(err,value){
            if(err){
                data = JSON.stringify(err);
                statusCode = 400;
            }else{
                data = value;
            }
            response.writeHead(statusCode, { 'Content-Type': 'application/json'});
            response.write(data);
            response.end();
        });
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
    }else if(request.method == 'DELETE'){
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
                manager.createTeam(JSON.parse(body), function(err,team){
                    if(err){
                        data = {
                                'error': 'ERROR',
                                'message': err
                            };
                        statusCode = 400;
                        response.writeHead(statusCode, { 'Content-Type': 'application/json'});
                        response.write(JSON.stringify(data));
                        response.end();
                    }else{
                        data = {
                                'action': 'CREATE_TEAM',
                                'status': 'SUCCESS',
                                'teamName': team.name,
                                'teamId': team.id
                        };
                        response.writeHead(statusCode, { 'Content-Type': 'application/json'});
                        response.write(JSON.stringify(data));
                        response.end();
                    }
                });
            }
        });



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
    }else{
        data = {
            'error' : 'INVALID_REQUEST',
            'message': 'This api only accept POST request of type x-www-form-urlencoded.'
        };
        statusCode = 400;
        response.writeHead(statusCode, { 'Content-Type': 'application/json'});
        response.write(JSON.stringify(data));
        response.end();
    }
}
