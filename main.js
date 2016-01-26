'use strict';
var
  app = require('express')(),
  port = process.env.PORT || 3000,
  parser = require('body-parser');

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
})); 

var pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: 'knex,public',
  pool: {
    min: 0,
    max: 5
  }
});


app.use(parser.json());

app.get('/', function (req, res, next) {
  res.send("Server is Running!!");
  return next();
});

app.get('/api/ping', function (req, res, next) {
  res.json('PONG');
  return next();
});

app.get('/api/notfound', function (req, res, next) {
  res.status(404).json('NotFound');
  return next();
});

app.post('/api/badrequest', function (req, res, next) {
  res.status(400).json('BadRequest');
  return next();
})

app.listen(port, function () {
  console.log('Server running with port', port);
});

app.get('/api/projects', function (req, res, next) {
  pg.select("id", "title", "description", "url", "created_at")
    .from("projects")
    .then(function(raws) {
      res.json(raws);
      return next();
    });
});

app.get('/api/projects/:id', function (req, res, next) {
  var id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    res.status("400").json("BadRequest");
    return next();
  }
  pg.select("id", "title", "description", "url", "created_at")
    .from("projects")
    .where({id: id})
    .then(function(raws) {
      if (raws.length === 0) {
        res.status("404").json("NotFound");
      } else {
        res.json(raws[0]);
      }
      return next();
    });
});

app.post('/api/projects', function (req, res, next) {
  if (!req.body.title || !req.body.description) {
    res.status("400").json("BadRequest");
    return next();
  }
  pg("projects")
    .returning("*")
    .insert({
      title: req.body.title,
      description: req.body.description,
      url: req.body.url
    }).then(function(data) {
      res.json(data);
      return next();
    })
});

app.delete('/api/projects/:id', function (req, res, next) {
  var id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    res.status("400").json("BadRequest");
    return next();
  }
  pg.select("id", "title", "description", "url", "created_at")
    .from("projects")
    .where({id: id})
    .then(function(raws) {
      if (raws.length === 0) {
        res.status("404").json("NotFound");
        return next();
      } else {
        // pg("projects").where({id: id}).del().then(function(data) {
        //   res.json(data);
        //   return next();
        // });
        res.json(raws[0]);
        return next();
      }
    });
});
