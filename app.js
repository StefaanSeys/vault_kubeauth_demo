const morgan = require('morgan');
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const https = require('https');

const instance = axios.create({
   httpsAgent: new https.Agent({  
     rejectUnauthorized: false
   })
 });

// Setup our server port
var server_port = process.env.VAULTKUBEAUTHDEMO_SERVICE_PORT || 8080;
var vault_host = process.env.VAULT_SERVICE_HOST || 'localhost';

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
   instance.post('https://' + vault_host + ':8200/v1/auth/kubernetes/login', {
      "jwt": token, 
      "role": "simple-node-app"
   })
  .then(response => {
      res.send(response);
      // curl -s -k --header "X-Vault-Token: $vault_token" $VAULT_ADDR/v1/secret/simple-node-app
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