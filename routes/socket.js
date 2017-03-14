var 
  Games = require('../models/game.js'),
  Users = require('../models/user.js');
module.exports = function(io) {
  io.sockets.on('connection', function(socket) {
    var self = socket;
    console.log('sokect connect',socket.id);
    socket.on("disconnect", function() {
      console.log("socket disconnected", socket.id);
    });

    socket.on('joinPlayer',function(data){
      console.log('socket joinPlayer \n\tId: %s\n\tSocket: %s',data.playerID,socket.id);
      self.join('room-'+data.gameCode,function(){
        console.log('rooms:',socket.rooms);
        Games.findOne({ code: data.gameCode }, function(err, g){
          if(g.num_players === g.players.length){
            io.to('room-'+g.code).emit('gotoGame',{game:g});
            // esto no me gusta mucho, otro dia lo pienso mejor
            for(var i=0, x = g.last_longitute ; i<x;i++){
              setTimeout(function(i,room,colors) {
                io.to(room).emit('background',{colorNum:colors[i]});
              }, 2000*(i+1),i, 'room-'+data.gameCode,g.last_random);
            }
            setTimeout(function(room){
              io.to(room).emit('showBtn',{ });
            }, 2000 * (g.last_longitute + 2),'room-'+data.gameCode);
          }else{
            Games.populate(g, { path: 'players', model: 'User' }, function(err, game){
              io.to('room-'+data.gameCode).emit('joinPlayer',{ players:game.players });
            });
          }
        });
      });
    });

  });
};// module
