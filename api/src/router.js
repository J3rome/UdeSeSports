// Router module
var helpers = require('./helpers.js');

module.exports = self = {
    handleUri: function(uriString){
        var uri = helpers.getSplittedUri(uriString);
        if(uri.length != 0){
            switch(uri[0]){
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
        return undefined;
    },
    routes: [

    ]

};
