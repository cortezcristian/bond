// User Test Cases
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
var assert = require('assert'),
  mongoose = require('mongoose');

// Require basic config files and DB connection
var dbConex = exports.dbConex = mongoose.connect('mongodb://localhost/gamedb');

// Global Variables for the test case
var User, user;

// Unit Tests
describe('Model Test User', function() {
  before(function() {
    // Before all tests
    Users = require("../models/user.js");
  });

  describe('User', function() {
    // It show create a new document in the database
    it('add a user', function(done) {
      var user = new Users({
        name: 'user' + Math.floor((Math.random() * 10) + 1)
      });
      user.save(done);
    });

    describe('find or create user by nickname', function(done) {
      var nickname = 'user' + Math.floor((Math.random() * 10) + 1);
      var userNew;
      it('New user\'s name ' + nickname, function(done) {
        Users.findOrCreate(nickname, function(err, user) {
          if (!err) {
            userNew = user;
            done();
          } else {
            done(err);
          }
        });
      });

      it('Find user\'s name ' + nickname, function(done) {
        Users.findOrCreate(nickname, function(err, user) {
          console.log(user._id , userNew._id);
          assert.equal(err, null /*,handleError(err)*/ );
          //assert.equal(userNew._id, user._id);
          done();
        });
      });
    });

  });
});
