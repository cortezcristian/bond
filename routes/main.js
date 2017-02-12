// Main Routes Here
var app = module.parent.exports.app,
  Games = require('../models/game.js'),
  Users = require('../models/user.js');

app.post('/create', function(req, res){
  res.json(req.body);
});
