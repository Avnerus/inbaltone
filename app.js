var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var browserify = require('browserify-middleware');
var app = express();
var fs = require('fs');
var _ = require("underscore");
var json2csv = require('json2csv');

app.use(bodyParser.json());
app.use(session({secret: 'inbaltone-rules!', resave: true, saveUninitialized: true}))
app.use(express.static(__dirname + '/public'));

app.get('/bundle.js', browserify('./inbaltone.js'));

app.get('/playlist/:name', function(req, res){
    fs.readdir('./public/' + req.params.name, function(err, files) {
        var list = [];
        list = files.map(function(filename) {
            parts = filename.split('-');
            return {filename: filename, index: parseInt(parts[0]), name: parts[1], answer: parseInt(parts[2])};
        });
        list = _.sortBy(list, function (cell) {
           return cell.index;  
        });

        console.log(list);
        res.send({list:list});
    });
});

app.post('/person', function(req, res){
    console.log(req.body.person);
    req.session.person = req.body.person;
    req.session.results = {};
    req.session.save(function(err) {
        if (err) {
            res.send({status: 1})
        } else {
            json2csv({data: req.body.person, fields: ['name', 'age', 'gender', 'motherTounge', 'otherLanguages']}, function(err, csv) {
              if (err) {
                  res.send({status: 1});
              } else {
                  fs.writeFile('./results/person.csv', csv, function(err) {
                      if (err) {
                          res.send({status: 1});
                      }
                      else {
                        res.send({status: 0})
                      }
                  });
              }
            });
        }
    })
});
app.post('/answer', function(req, res){
    console.log(req.body);
    if (!req.session.results[req.body.set]) {
        req.session.results[req.body.set] = [];
    }
    req.session.results[req.body.set].push ({index: req.body.counter, name: req.body.name, correct: req.body.correct});
    req.session.save(function(err) {
        if (err) {
            res.send({status: 1})
        } else {
            res.send({status:0})
        }
    })
});

app.post('/output/:set', function(req, res){
    json2csv({data: req.session.results[req.params.set], fields: ['index', 'name', 'correct']}, function(err, csv) {
      if (err) {
          res.send({status: 1});
      } else {
          fs.writeFile('./results/' + req.params.set + '.csv', csv, function(err) {
              if (err) {
                  res.send({status: 1});
              }
              else {
                res.send({status: 0})
              }
          });
      }
    });
});

app.get('/', function(req, res){
  res.render('index.ejs');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
