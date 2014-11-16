// Highlevel abstraction of the backend. Provide interface to manage the backend.

var helpers = require('./helpers.js'),
    gameParser = require('./gameParser.js'),
    level = require('levelup'),
    sublevel = require('level-sublevel'),
    db = sublevel(level('./testDb', {'valueEncoding':'json'})),
    matches = db.sublevel('matches'),
    teams = db.sublevel('teams'),
    players = db.sublevel('players'),
    self;

    // TODO: Global error catching, node can't crash because of an error of parsing..

module.exports = self = {
    // Create an entry in DB for a new team
    // The data must contain the name and a list of valid players id
    createTeam : function(data, callback) {
        helpers.getId(teams, function(generatedId){
            if(generatedId == undefined){
                // Id generation failed
                // TODO: Implement error handling (call callback with internal err ?)
            }else if(helpers.validateTeamData(data)){
                // TODO : More validation on players, does the id exist ?
                //        (require callback, edit this in helpers.js)
                var team = {
                    id: generatedId,
                    name: data.name,
                    players: data.players,
                    victories: 0,
                    defeats: 0,
                    seed: 0,
                    player_most_kills: '',
                    player_most_assists: '',
                    player_least_deaths: '',
                    player_best_kda: '',
                    player_best_kill_participation: '',
                    player_most_wards_bought: '',
                    player_most_wards_placed: ''
                };
                teams.put(generatedId,team,function(err){
                    if(err){
                        callback(err);
                    }else{
                        callback(undefined,team);
                    }
                });
            }else{
                // Data provided are not valid
            }
        });
    },
    getTeam : function(id, callback){
        teams.get(id,function(err,value){
            if(err){
                // TODO: Handle error here
                callback(err);
            }else{
                callback(undefined,value);
            }
        });
    },
    getAllTeams : function(callback){
        var allTeams = [];
        teams.createReadStream().on('data', function(team){
            // TODO : Verify order
            allTeams.push(team.value);
        }).on('error', function(err){
            // TODO: Handle only the first error ? Or buffer them and try to read all data ?
            callback(err);
        }).on('close', function () {
        }).on('end', function() {
            if(allTeams.length == 0){
                // TODO : Return something else than an empty list
            }
            callback(undefined, allTeams);
        });
    },
    getTeamName : function(id, callback){
        // TODO : Validate team name is not empty
        teams.get(id,function(err,value){
            if(err){
                // TODO: Handle error here
                callback(err);
            }else{
                callback(undefined,value.name);
            }
        });
    },
    saveMatche : function(data, callback){
        helpers.getId(matches, function(generatedId){
            if(generatedId == undefined){
                // Id generation failed
                // TODO: Implement error handling (call callback with internal err ?)
            }else if(helpers.validateMatcheData(data)){
                // TODO : Should we just include underscore in here ?
                data = gameParser.getGameInfos(data);
                helpers._.extend(data,{'id':generatedId});
                // TODO: Implement hook on this ?
                // TODO: Update infos in players profiles
                // TODO: Identify the teamId associated with the 2 teams of this game, extend the object with both teams id
                // TODO: associate each player with a playerid corresponding with it summoner name
                matches.put(generatedId, data, function(err){
                    if(err){
                        callback(err);
                    }else{
                        callback(undefined, data);
                    }
                });
            }
        });
    },
    getMatche : function(id, callback){
        matches.get(id, function(err,value){
            if(err){
                callback(err);
            }else{
                callback(undefined,value);
            }
        });
    },
    getAllMatches : function(callback){
        var allMatches = [];
        matches.createReadStream().on('data', function(matche){
            // TODO : Verify order
            allMatches.push(matche.value);
        }).on('error', function(err){
            // TODO: Handle only the first error ? Or buffer them and try to read all data ?
            callback(err);
        }).on('close', function () {
        }).on('end', function() {
            callback(undefined, allMatches);
        });
    },
    createPlayer : function(data, callback){
        helpers.getId(players, function(generatedId){
            if(generatedId == undefined){
                // Id generation failed
                // TODO : Implement error handling (call callback with internal err ?)
            }else if(helpers.validatePlayerData(data)){
                // TODO : More validation on players, does the id exist ?
                //        (require callback, edit this in helpers.js)
                var player = {
                    id: generatedId,
                    summonerName: data.summonerName,
                    firstName : data.firstName,
                    lastName : data.lastName,
                    email : data.email,
            	    rank : data.rank,              // TODO : Parse rank in enum
                    teamId : data.teamId,       // TODO : Validate team ID
                    kills : 0,
                    deaths : 0,
                    assists : 0,
                    kda : 0,
                    kill_participation : 0
                };
                players.put(generatedId, player, function(err){
                    if(err){
                        callback(err);
                    }else{
                        callback(undefined, player);
                    }
                });
            }else{
                // Data provided are not valid
            }
        });
    },
    getPlayer : function(id, callback){
        players.get(id, function(err,value){
            if(err){
                callback(err);
            }else{
                self.getTeamName(value.teamId, function(err, teamName){
                    if(err){
                        callback(err);
                    }else{
                        value.teamName = teamName;
                        callback(undefined,value);
                    }
                });
            }
        });
    },
    getAllPlayers : function(callback){
        var allPlayers = [];
        players.createReadStream().on('data', function(player){
            // TODO : Verify order
            allPlayers.push(player.value);
        }).on('error', function(err){
            // TODO: Handle only the first error ? Or buffer them and try to read all data ?
            callback(err);
        }).on('close', function () {
            console.log('GetAllPlayers stream closed');
        }).on('end', function() {
            callback(undefined, allPlayers);
        });
    }
}
