require('dotenv').config(); 

let tokenOptions = {
  method: 'POST',
  url: 'https://kpi.eu.auth0.com/oauth/token',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience:  process.env.AUDIENCE,
    grant_type: 'client_credentials'
  }
};

fetch("https://kpi.eu.auth0.com/oauth/token", tokenOptions)
  .then(response => response.json())
  .then(tokenData => {
    let userHeaders = new Headers();
    userHeaders.append("Content-Type", "application/json");
    userHeaders.append("Authorization", `Bearer ${tokenData.access_token}`);

    let userOptions = {
      method: 'POST',
      headers: userHeaders,
      body: JSON.stringify({
        "email": "nastia262002@gmail.com",
        "user_id": "3",
        "password": "Password3*___strAit",
        "connection": "Username-Password-Authentication",
        "user_metadata": {
          "username": "user3",
          "phone_number": "+380682042222"
        }
      })
    };
    return fetch("https://kpi.eu.auth0.com/api/v2/users", userOptions);
  })
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));














