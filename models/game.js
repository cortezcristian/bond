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
    creator     : { type  : Schema.Types.ObjectId, ref : 'Users' },
	  created     : Date
});

// ### Hooks
// #### Pre-Save
gameSchema.pre("save", function(next) {
    if(!this.code) {
        this.code = randomstring.generate(7);
    }
    if(!this.created)
        this.created = new Date();
    next();
});

// ### Method:
gameSchema.method("instanceMethod", function(param, cb) {
    var game = this;
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
