// User Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//
var mongoose = require('mongoose'),
    Games = require('./game.js'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    nickname      : String,
    created       : Date
});

var validUser = /^(?!.*\.\.)(?!.*\.$)@?[^\W][\w.\-@]{0,29}$/;

// ### Hooks
// #### Pre-Save
userSchema.pre("save", function(next) {
    if(!this.created) {
        this.created = new Date();
    }
    next();
});

// ### Method:
userSchema.method("createGame", function(num_players, cb) {
    var user = this;
    var game = new Games();
    game.num_players = num_players;
    game.creator = user._id;
    game.players = [];
    game.players.push(user._id);
    game.save(cb);
});

// ### Method:
userSchema.method("joinGame", function(code, cb) {
    var user = this;
    Games.findOne({code: code}, function(err, game){
      console.log("Game found:", game);
      if(err) {
        return cb(err);
      }
      if(!game){
        return cb(new Error("Game not found"));
      }
      game.players.push(user._id);
      game.save(cb);
    });
});

// ### Static:
userSchema.statics.findOrCreate = function (nickname, cb) {
  var User = this;

  if(validUser.test(nickname)){
    User.findOne({ nickname : nickname }, function(err, user){
      if(err) {
        cb(err);
      } else if(!user) {
        // Creating user
        console.log("creating user", nickname);
        user = new User();
        user.nickname = nickname;
        user.save(cb);
      } else {
        cb(err, user);
      }
    });
  } else  {
    cb(new Error('Username is not valid.'));
  }
};

// Export module
module.exports = mongoose.model('User', userSchema);
