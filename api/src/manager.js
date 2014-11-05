// Highlevel abstraction of the backend. Provide interface to manage the backend.

var helpers = require('./helpers.js'),
    level = require('level',{'keyEncoding':'string','valueEncoding':'json'}),
    sublevel = require('level-sublevel'),
    db = sublevel(level('./testDb')),
    matches = db.sublevel('matches'),
    teams = db.sublevel('teams'),
    players = db.sublevel('players');

module.exports = {
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
                teams.put(generatedId,JSON.stringify(team),function(err){
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
    }
}
