var 
  Games = require('../models/game.js'),
  Users = require('../models/user.js');
module.exports = function(io) {
  var playersConnected = [];
  function addPlayer(id,socket){
    // si esta no agregar XD
    console.log('->> addPlayer \n\tId: %s\n\tSocket: %s',id,socket.id);
    playersConnected.push({playerID:id,socket:socket});
  }

  function removePlayers(id){
    for(var i=0; i< playersConnected.length;i++){
      if(playersConnected[i].socket.id===id){
        console.log('socket disconnected:', playersConnected.slice(i,1)[0].socket.id);
        break;
      }
    }
  }

  io.sockets.on('connection', function(socket) {
    var self = socket;
    console.log('->>  sokect connect',socket.id);
    socket.on("disconnect", function() {
      //console.log("socket disconnected", socket.id);
      removePlayers(socket.id);
    });

    socket.on('joinPlayer',function(data){
      addPlayer(data.playerID,self);
      //console.log(playersConnected[0].playerID,playersConnected[0].socket.id);
      Games.findOne({ code: data.gameCode }, function(err, g){
        Games.populate(g, { path: 'players', model: 'User' }, function(err, game){
          playersConnected[0].socket.emit('joinPlayer-'+data.gameCode, { players:game.players });
        });
      });
    });

  });
};// module
