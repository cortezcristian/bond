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
    start       : { type  : Date },
    timeout     : {type   : Number, default: 60000},
    last_random : { type  : String, default : '' },
    last_entered    : { type  : String, default : '' },
    last_longitute  : { type  : Number, default : 4 },
    status      : { type  : String, default : 'In Progress' }, // Win, Lost
    rounds      : [], // rounds history


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
      charset: '1234567'
    });
  doc.timeout = (40000+ doc.last_longitute*3000 ) / (doc.rounds.lenght>0||1);
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
        var end = new Date();
        var duration =  end.getTime() - game.start.getTime() ;
      if( duration <= game.timeout  && game.last_entered.length === game.last_random.length){
        game.status = "You Win";
        game.rounds.push(game.last_random);
        game.last_longitute++;
        game.last_random = "";
        game.last_entered= "";
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
