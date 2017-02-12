// User Model
// -----------------------------

// Modules Dependencies:
//  - Mongoose (http://mongoosejs.com/docs/guide.html)
//
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    nickname      : String,
    created       : Date
});

// ### Hooks
// #### Pre-Save
userSchema.pre("save", function(next) {
    if(!this.created) {
        this.created = new Date();
    }
    next();
});

// ### Static:
userSchema.statics.findOrCreate = function (nickname, cb) {
  var User = this;
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
}

// Export module
module.exports = mongoose.model('User', userSchema);
