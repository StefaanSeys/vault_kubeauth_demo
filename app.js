const morgan = require('morgan');
const express = require('express');

var app = express();


var server_port = process.env.VAULTKUBEAUTHDEMO_SERVICE_PORT || 8080
var server_ip_address = process.env.VAULTKUBEAUTHDEMO_SERVICE_HOST || '127.0.0.1'

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(server_port, server_ip_address, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})