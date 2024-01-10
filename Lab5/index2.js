const express = require('express');
const app = express();
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const request = require('request');
const jwt = require('jsonwebtoken'); 
const fs = require('fs');




const checkJwt = auth({
  audience: 'https://kpi.eu.auth0.com/api/v2/',
  issuerBaseURL: 'https://kpi.eu.auth0.com/',
});

app.get('/api/public', async function (req, res) {
  try {
    const token = await getToken();
    res.json({
      message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.',
      token: token,
    });
  } catch (error) {
    console.error('Error getting token:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/private', checkJwt, function (req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.',
  });
});

const checkScopes = requiredScopes('read:messages');

app.get('/api/private-scoped', checkJwt, checkScopes, function (req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.',
  });
});

async function getToken() {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://kpi.eu.auth0.com/oauth/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      form: {
        client_id: 'JIvCO5c2IBHlAe2patn6l6q5H35qxti0',
        client_secret: 'ZRF8Op0tWM36p1_hxXTU-B0K_Gq_-eAVtlrQpY24CasYiDmcXBhNS6IJMNcz1EgB',
        audience: 'https://kpi.eu.auth0.com/api/v2/',
        grant_type: 'client_credentials',
      },
    };

    request(options, function (error, response, body) {
      if (error) {
        reject(new Error(error));
      } else {
        const parsedBody = JSON.parse(body);
        resolve(parsedBody.access_token);
      }
    });
  });
}

const publicKey = fs.readFileSync('/home/anastasiii/Downloads/kpi.pem');

app.use(async (req, res, next) => {
    try {
      const token = await getToken();
      if (token) {
        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
              console.error('Token verification failed:', err.message);
              return res.status(401).json({ message: 'Token verification failed' });
            }
            req.user = decoded;
            console.log('Token successfully verified!');
            next();
          });
            
      } else {
        return res.status(401).json({ message: 'Token not provided' });
      }
    } catch (error) {
      console.error('Error verifying token:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(3000, function () {
  console.log('Listening on http://localhost:3000');
});
