// Main Routes Here
var app = module.parent.exports.app,
  dbConex = module.parent.exports.dbConex,
  Games = require('../models/game.js'),
  Users = require('../models/user.js');

app.post('/create', function(req, res){
  Users.findOrCreate(req.body.nickname, function(err, user){
    user.createGame(req.body.num_players, function(err, g){
      Games.populate(g, { path: 'players', model: 'User' }, function(err, game){
        res.render('share', {player: user, code: game.code, num_players: game.num_players, players: game.players });
      });
    });
  });
});

app.get('/join/:code', function(req, res){
  Games.findOne({ code: req.params.code }, function(err, game){
    res.render('join', { code: game.code, num_players: game.num_players });
  });
});

app.post('/join/:code', function(req, res){
  Users.findOrCreate(req.body.nickname, function(err, user){
    user.joinGame(req.params.code, function(err, game){
      console.log("user added:", err, game);
        Games.populate(game, { path: 'players', model: 'User' }, function(err, game){
          res.render('share', { player: user, code: game.code, num_players: game.num_players, players: game.players });
        });
    });
  });
});
