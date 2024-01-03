const request = require("request");
require('dotenv').config(); 

let options = {
  method: 'POST',
  url: 'https://kpi.eu.auth0.com/oauth/token',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  form: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience: process.env.AUDIENCE,
    grant_type: 'password',
    username: 'alice4study@gmail.com',
    password: 'D*04i_nA',
    scope: 'offline_access'
  }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
