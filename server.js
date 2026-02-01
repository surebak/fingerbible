var express = require('express');
var app = express();
var http = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));


http.listen(8000, function() {
    console.log('listening on *:8000');
});