const morgan = require('morgan');
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const https = require('https');

// Setup our server port
var server_port = process.env.VAULTKUBEAUTHDEMO_SERVICE_PORT || 8080;



const instance = axios.create({
   httpsAgent: new https.Agent({  
     rejectUnauthorized: false
   })
 });



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

   // Get the Vault host
   var vault_protocol = process.env.VAULT_SERVICE_PROTOCOL || 'https';
   var vault_host = process.env.VAULT_SERVICE_HOST || 'localhost';
   var vault_port = process.env.VAULT_PORT || 8200;
   var vault_service = vault_protocol + "://" + vault_host + ":" + vault_port;


   // Call the two vault APIs in a row
   instance.post(vault_service + '/v1/auth/kubernetes/login', {
      "jwt": token, 
      "role": "nodeapp-one"
   })
  .then(response => {
      let client_token = response.data.auth.client_token;
      let config = {
         headers: {'X-Vault-Token': client_token}
      };
      return instance.get(vault_service + '/v1/kv/nodeapp/one/stuff', config);
      
  })
  .then(response => {
      res.send("Success! The password stored in Vault is \"" + response.data.data.personal_secret + "\"");
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