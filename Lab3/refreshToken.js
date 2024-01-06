let request = require("request");
require('dotenv').config();

let options = {
  method: "POST",
  url: "https://kpi.eu.auth0.com/oauth/token",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  form: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: process.env.REFRESH_TOKEN,
    grant_type: "refresh_token",
  },
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
