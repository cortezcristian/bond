// Game Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//
var mongoose = require('mongoose'),
    randomstring = require("randomstring"),
    Schema = mongoose.Schema;

var gameSchema = new Schema({
    name        : String,
    code        : String,
    num_players : Number,
    players     : [], // 2-5 Players
    creator     : { type  : Schema.Types.ObjectId, ref : 'User' },
    last_random : { type  : String, default : '' },
    last_entered : { type  : String, default : '' },
    last_longitute : { type  : Number, default : 4 },
    status      : { type  : String, default : 'In Progress' }, // Win, Lost
    rounds : [], // rounds history
	  created     : Date
});

// ### Hooks
// #### Pre-Save
gameSchema.pre("save", function(next) {
    var doc = this;
    if(!doc.code) {
        doc.code = randomstring.generate(7);
    }
    if(!doc.last_random || doc.last_random === ""){
        doc.last_random = randomstring.generate({
          length: doc.last_longitute || 4,
          charset: '123456'
        });
    }
    if(!doc.created)
        doc.created = new Date();
    next();
});

// ### Method:
gameSchema.method("try", function(number, cb) {
    var game = this;
    game.last_entered += ""+number;
    var regex = new RegExp("^"+game.last_entered);
    if(game.last_random.match(regex)){
      if(game.last_entered.length === game.last_random.length){
        game.status = "You Win";
        // TODO: In case of win
        // create a new round and reset the game
      }
    } else {
      game.status = "You Lost";
    }
    console.log("Game Status: ", game.status, game);
    this.save(cb);
});

// ### Static:
gameSchema.statics.customMethod = function (paramid, cb) {
  var Game = this;
  Game.findOne({ _id: paramid}, function(err, game){
      cb(err, game);
  });
}

// Export module
module.exports = mongoose.model('Game', gameSchema);
