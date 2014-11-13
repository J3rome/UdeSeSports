// Router module
var helpers = require('./helpers.js');

// TODO: Add another level (/matches/action/{GET-POST})

module.exports = self = {
    handleFirstLevelUri: function(uriString){
        var uri = helpers.getSplittedUri(uriString);
        if(uri.length != 0){
            switch(uri[0]){
                case 'manage':
                    return 'handleManager';
                break;

                default:
                    return undefined;
                break;
            }
        }
    },
    handleManagerUri: function(uriString){
        var uri = helpers.getSplittedUri(uriString);
        if(uri.length != 0){
            switch(uri[1]){
                case 'teams':
                    return 'handleTeams';
                break;

                case 'players':
                    return 'handlePlayers';
                break;

                case 'matches':
                    return 'handleMatches';
                break;

                default:
                    return undefined;
                break;
            }
        }
    },
    routes: [

    ]

};
