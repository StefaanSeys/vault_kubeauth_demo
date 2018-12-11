const morgan = require('morgan');
const express = require('express');
const fs = require('fs');
const axios = require('axios');

// Setup our server port
var server_port = process.env.VAULTKUBEAUTHDEMO_SERVICE_PORT || 8080

// We read our Kubernetes service account token at the start
let token = ""
try {
   token = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token', 'utf8');
} catch (err) {
   console.log("ERROR: could not read token from the file system");
}

// Create our express instance
var app = express();

// Set up the one path we will listen on ("/")
app.get('/', function (req, res) {

   // Call the two vault APIs in a row
   axios.post('https://localhost:8200/v1/auth/kubernetes/login', {
      "jwt": token, 
      "role": "simple-node-app"
   })
  .then(response => {
      res.send(response);
  })
  .catch(error => {
     console.log(error);
      res.send("error");
  });

      
   
})

// Start the server
var server = app.listen(server_port, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Simple Node App listening at http://%s:%s", host, port)
})