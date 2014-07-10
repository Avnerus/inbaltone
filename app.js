var express = require('express');
var app = express();
var fs = require('fs');

app.get('/sounds', function(req, res){
    fs.readdir('./sounds', function(err, files) {
        console.log(err, files);
        res.send(JSON.stringify(files));
    });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
