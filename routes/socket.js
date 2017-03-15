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
            var roomCode = 'room-'+g.code;
            io.to(roomCode).emit('gotoGame',{game:g});
            var listSocket = createSocketPlayerList(roomCode);
            // esto no me gusta mucho, otro dia lo pienso mejor
            for(var i=0, x = g.last_longitute ; i<x;i++){
              setTimeout(function(i,room,colors) {
                console.log(colors[i]);
                io.to(room).emit('background',{colorNum:colors[i]});
              }, 2000*(i+1),i, roomCode,g.last_random);
            }
            setTimeout(function(room,socket){
              io.to(room).emit('showBtn',{ });
              startGame(listSocket,roomCode);
            }, 2000 * (g.last_longitute + 2),roomCode,socket);
          } else {
            Games.populate(g, { path: 'players', model: 'User' }, function(err, game){
              io.to('room-'+data.gameCode).emit('joinPlayer',{ players:game.players });
            });
          }
        });
      });
    });

    function createSocketPlayerList(roomCode){
      var scktID=[];
      // console.log(room.sockets,room.length);
      var room = socket.adapter.rooms[roomCode];
      for( key in room.sockets){
        scktID.push(key);
      }
      return scktID;
    }
    function youTrun(scktID,room,roomCode){
      io.to(roomCode).emit('youTrun',{ value: false });
      io.to(scktID[getRandomInt(room.length)]).emit('youTrun',{value:true });
    }
    function startGame(socketID,roomCode){
      var room = socket.adapter.rooms[roomCode];
      youTrun(socketID,room,roomCode);

    }

  });
};// module
