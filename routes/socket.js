module.exports = function(io) {
  io.sockets.on('connection', function(socket) {
    console.log('->>  sokect connect',socket.id);
    socket.on("disconnect", function() {
      console.log("socket disconnected", socket.id);
    });

socket.emit('joinPlayer', {
  players: "nure players"
});
socket.on('onServer', function(data) {
  console.log('->>  ', data);
});
    socket.on('id',function(){

    });
  
  });
};
