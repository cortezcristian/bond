var bower = require('bower'),
    path = require('path');

// Error
process.on('uncaughtException', function(err) {
      console.log("Exception", err.stack);
});

console.log('Starting directory: ' + process.cwd());
// Install for site
// ./views/layout.jade
bower.commands
.install([path.resolve(".")+"/bower.json"])
.on('end', function (installed) {
    console.log(installed);
    console.log("Finish Installing Site Components")
    try {
      process.chdir(path.resolve(".")+"/public/scripts/admin/");
      console.log('New directory: ' + process.cwd());
    }
    catch (err) {
      console.log('chdir: ' + err);
    }

});

