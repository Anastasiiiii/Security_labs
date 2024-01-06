require('dotenv').config();
const axios = require("axios");
var userId = process.env.CLIENT_ID;

var options = {
  method: "PATCH",
  url: `https://kpi.eu.auth0.com/api/v2/users/${userId}`,
  headers: {
    "content-type": "application/json",
    authorization:
      `Bearer ${process.env.CLIENT_ACCESS_TOKEN}`,
  },
  data: JSON.stringify({
    password: process.env.PASSWORD,
    connection: "Username-Password-Authentication",
    scope: 'read:current_user update:current_user_metadata delete:current_user_metadata create:current_user_metadata create:current_user_device_credentials delete:current_user_device_credentials update:current_user_identities offline_access'
  })
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
