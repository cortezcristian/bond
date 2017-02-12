// Main Routes Here
var app = module.parent.exports.app,
  Games = require('../models/game.js'),
  Users = require('../models/user.js');

app.post('/create', function(req, res){
  Users.findOrCreate({ nickname: req.body.nickname}, function(user){
    res.json(user);
  });
});
