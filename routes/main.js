// Main Routes Here
var app = module.parent.exports.app,
  dbConex = module.parent.exports.dbConex,
  Games = require('../models/game.js'),
  Users = require('../models/user.js');

app.post('/create', function(req, res){
  console.log(req.body);
  Users.findOrCreate(req.body.nickname, function(err, user){
    res.json(user);
  });
});
