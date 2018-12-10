const morgan = require('morgan');
const express = require('express');

var app = express();


var server_port = process.env.VAULTKUBEAUTHDEMO_SERVICE_PORT || 8080

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(server_port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})