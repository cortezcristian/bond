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
            startGame(g,roomCode);
          } else {
            Games.populate(g, { path: 'players', model: 'User' }, function(err, game){
              io.to('room-'+data.gameCode).emit('joinPlayer',{ players:game.players });
            });
          }
        });
      });
    });

    socket.on('inputGame',function(data){
      var roomCode='room-'+data.gameCode;
      var room = socket.adapter.rooms[roomCode];
        Games.findOne({ code: data.gameCode }, function(err, g){
          g.try( data.input, function(err, game){
            if( /In Progress/.test(game.status)){
              youTrun(room,roomCode);
            } else {
              var winner = !/You Lost/.test(game.status);
              io.to(roomCode).emit('winOrLost',{value:winner, level: game.rounds.length+1});
              if(winner){
                setTimeout(function(game,roomCode){
                  startGame(game,roomCode);
                },2500,game,roomCode);
              }
            }
            io.to(roomCode).emit('gotoGame',{game:game});
          });
        });
    });
    function createSocketPlayerList(roomCode){
      var scktID=[];
      var room = socket.adapter.rooms[roomCode];
      // console.log(room.sockets,room.length);
      //console.log(socket.nsp.sockets);
      //console.log(socket.adapter.rooms);
      for( key in room.sockets){
        scktID.push(key);
      }
      return scktID;
    }
    function youTrun(room,roomCode){
      var listSocket = createSocketPlayerList(roomCode);
      io.to(roomCode).emit('youTrun',{ value: false });
      io.to(listSocket[getRandomInt(room.length)]).emit('youTrun',{value:true });
    }
    function playGame(roomCode){
      var room = socket.adapter.rooms[roomCode];
      youTrun(room,roomCode);
    }
    function startGame(game,roomCode){
      game.status = 'In Progress';
      game.start = new Date();
      game.save();
      // esto no me gusta mucho, otro dia lo pienso mejor
      for(var i=0, x = game.last_longitute ; i<x;i++){
        setTimeout(function(i,room,colors) {
          console.log(colors[i]);
          io.to(room).emit('background',{colorNum:colors[i]});
        }, 2000*(i+1),i, roomCode,game.last_random);
      }
      setTimeout(function(room){
        io.to(room).emit('background',{colorNum : undefined });
        playGame(roomCode);
      }, 1500 * (game.last_longitute + 2),roomCode);
    }

  });
};// module
