require('dotenv').config();
import axios from "axios";
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
    scope: 'offline_access'
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
