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
