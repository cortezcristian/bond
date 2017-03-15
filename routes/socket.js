var 
  Games = require('../models/game.js'),
  Users = require('../models/user.js');
module.exports = function(io) {
  function getRandomInt(max) {
    return Math.floor(Math.random() *  max);
  }

  io.sockets.on('connection', function(socket) {
    var self = socket;
    console.log('sokect connect',socket.id);
    socket.on("disconnect", function() {
      console.log("socket disconnected", socket.id);
    });

    socket.on('joinPlayer',function(data){
      console.log('socket joinPlayer \n\tId: %s\n\tSocket: %s',data.playerID,socket.id);
      self.join('room-'+data.gameCode,function(){
        console.log('room: ',socket.adapter.rooms['room-'+data.gameCode]);
        Games.findOne({ code: data.gameCode }, function(err, g){
          if(g.num_players === g.players.length){
            io.to('room-'+g.code).emit('gotoGame',{game:g});
            // esto no me gusta mucho, otro dia lo pienso mejor
            for(var i=0, x = g.last_longitute ; i<x;i++){
              setTimeout(function(i,room,colors) {
                console.log(colors[i]);
                io.to(room).emit('background',{colorNum:colors[i]});
              }, 2000*(i+1),i, 'room-'+data.gameCode,g.last_random);
            }
            setTimeout(function(room,socket){
              io.to(room).emit('showBtn',{ });
              getSocketID(socket,'room-'+data.gameCode);
            }, 2000 * (g.last_longitute + 2),'room-'+data.gameCode,socket);
          } else {
            Games.populate(g, { path: 'players', model: 'User' }, function(err, game){
              io.to('room-'+data.gameCode).emit('joinPlayer',{ players:game.players });
            });
          }
        });
      });
    });

    var scktID=[];
    function youTrun(sckt,room,roomCode){
      console.log(scktID[1] );
      io.to(roomCode).emit('youTrun',{ value: false });
      //sckt.broadcast.to(scktID[getRandomInt(room.length)]).emit('youTrun',{value:true });
      sckt.broadcast.to(scktID[0]).emit('youTrun',{value:true });
    }
    function getSocketID(sckt,roomCode){
      // console.log(room.sockets,room.length);
      var room = socket.adapter.rooms[roomCode];
      for( key in room.sockets){
        scktID.push(key);
      }
      youTrun(sckt,room,roomCode);
    }

  });
};// module
