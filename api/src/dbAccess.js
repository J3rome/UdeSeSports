var levelup = require('level',{'keyEncoding':'string','valueEncoding':'json'}),
    sublevel = require('level-sublevel'),
    db = sublevel(levelup('./testDb2')),
    matches = db.sublevel('matches'),
    teams = db.sublevel('teams'),
    players = db.sublevel('players');


module.exports = {
   put : function(level,key,value,callback){
      if(level){
         var selectedLevel = getSubLevel(level);
         selectedLevel.put(key,value,function(err){
               if(err){
                  callback({
                              'error': 'INVALID_BODY',
                              'message': 'The body of the request is invalid.'
                           });
               }else{
                  console.log('Key \''+key+'\' inserted');
                  callback();
               }
         });
      }else{
         callback({
                     'error': 'INVALID_LEVEL',
                     'message': 'The sublevel is invalid.'
                  });
      }
   },
   delete : function(level,key,callback){
      if(level){
         var selectedLevel = getSubLevel(level);
         db.del(key,function(err){
             // TODO: Good error abstraction
            if(err){
               callback({
                           'error': 'INVALID_KEY',
                           'message': 'The key is invalid.'
                        });
            }else{
               console.log('Key \''+key+'\' deleted');
               callback();
            }
         });
      }else{
         callback({
                     'error': 'INVALID_LEVEL',
                     'message': 'The sublevel is invalid.'
                  });
      }
   },
   get : function(level,key,callback){
      if(level){
         var selectedLevel = getSubLevel(level);
         db.get(key, function(err,value){
            // TODO: Good error abstraction
            if(err){
               callback({
                           'error': 'INVALID_KEY',
                           'message': 'The key is invalid.'
                        });
            }else{
               console.log('Key \''+key+'\' accessed');
               callback(undefined,value);
            }
         });
      }else{
         callback({
                     'error': 'INVALID_LEVEL',
                     'message': 'The sublevel is invalid.'
                  });
      }
   }

}

function getSubLevel(level){
   if(level == "main"){
      return db;
   }else if(level == "matches"){
      return matches;
   }else if(level == "teams"){
      return teams;
   }else if(level == "playes"){
      return players;
   }
   return;
}
// getSubLevel : function(level)
