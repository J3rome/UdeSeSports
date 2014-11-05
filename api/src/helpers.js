// Helpers functions
var _ = require('underscore');

// Constants
var ID_RETRY_LIMIT = 15;

module.exports = self = {
   // Return a valid Id for the selected db sublevel
    getId: function(db,callback,counter){
        if(counter == undefined){
            counter = 0;
        }
        var id = generateId();

        isIdValid(id,db,function(isValid){
            if(isValid){
                callback(id);
                return;
            }else if(counter < ID_RETRY_LIMIT){
                counter++;
                self.getId(db,callback,counter);
            }else{
                callback();    // Return nothing if we can't create id
            }
        });
    },
    // Return true if the data required for the creation of a new team are valid
    validateTeamData: function(data){
        if(data.name && data.players && data.players.length > 0){
            return true;
        }
        return false;
    }
}

// Generate random id
function generateId(){
    var guid1 = Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);

    var guid2 = Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);

    return guid1 + '-' + guid2;
}
// Verify if the id is valid (if it doesn't already exist)
function isIdValid(id, db, callback){
    db.get(id,function(err,value){
        if(err && err.notFound){
            callback(true);
        }else {
            callback(false);
        }
    });
}
