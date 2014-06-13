'use strict';

var express     = require('express');
var fs          = require('fs');
var app         = express();

app.get('/log', function (req, res) {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Origin', '*');
    res.send(200, 'ok')

    // stdout - expects managing process to redirect this to a file
    console.log(['event:' + req.query['event'], req.query['path'], req.query['date']].join("\t"));
});

app.get('/logs', function (req, res) {
    res.send(200, fs.readFileSync('./log', { encoding: 'utf-8' }));
});

var server = app.listen(5001);
