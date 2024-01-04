const axios = require("axios");

async function getToken() {
  try {
    const response = await axios.post('https://kpi.eu.auth0.com/oauth/token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: process.env.AUDIENCE,
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      realm: 'Username-Password-Authentication',
      username: 'alice4study@gmail.com',
      password: process.env.PASSWORD,
      scope: 'offline_access'
    });

    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

getToken();
