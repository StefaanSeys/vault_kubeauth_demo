const morgan = require('morgan');
const express = require('express');
var fs = require('fs')

var app = express();


var server_port = process.env.VAULTKUBEAUTHDEMO_SERVICE_PORT || 8080

app.get('/', function (req, res) {
   var resp = 'Read failed';
   try {
      resp = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token', 'utf8');
   } catch (err) {
      resp = err.toString();
   }   
   res.send(resp);
})

var server = app.listen(server_port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})