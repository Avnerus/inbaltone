var express = require('express');
var browserify = require('browserify-middleware');
var app = express();
var fs = require('fs');

app.get('/bundle.js', browserify('./inbaltone.js'));

app.get('/soundlist', function(req, res){
    fs.readdir('./public/sounds', function(err, files) {
        console.log(err, files);
        res.send({list:files});
    });
});

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
