
var request = require("request");

var options = { method: 'POST',
  url: 'https://kpi.eu.auth0.com/oauth/token',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  form:
   { client_id: '{yourClientId}',
     device_code: 'YOUR_DEVICE_CODE',
     grant_type: 'urn:ietf:params:oauth:grant-type:device_code' }
   };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});