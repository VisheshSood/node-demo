/*
    server.js
    main server script for our task list web service
*/
var express = require('express');
var sqlite = require('sqlite3');

var app = express();

var port = 8080;

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());


app.get('/api/tasks', function (req, res, next) {
    var sql = 'select rowid, title, done, createdOn from tasks where done != 1';
    db.all(sql, function(err, rows) {
        if (err) {
            return next(err);
        }
        res.json(rows);
    });
});

app.post('/api/tasks', function(req,res,next) {
    var newTasks = { 
        title: req.body.title,
        done: false,
        createdOn: new Date()
    }

    var sql = 'insert into tasks (title, done, createdOn) values (?,?,?)';
    db.run(sql, [newTasks.title, newTasks.done, newTasks.createdOn], function(err) {
        if (err) {
            return next(err);
        }

        res.status(201).json(newTasks);
    })
});

app.put('/api/tasks/:rowid', function(req,res,next) {

    var sql = 'update task s set done=? where rowid =?';
    db.run(sql, [req.body.done, req.params.rowid], function(err) {
        if (err) {
            return next (err);
        }
        res.json(req.body);
    })



})

var db = new sqlite.Database(__dirname + '/data/tasks.db', function (err) {
    if (err) {
        throw err;
    }

    var sql = 'create table if not exists tasks(title string, done int, createdOn datetime)';

    db.run(sql, function (err) {
        if (err) {
            throw err;
        }
    });

    app.listen(port, function() {
        console.log('server is listening');
    });

});
