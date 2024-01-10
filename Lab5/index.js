const express = require('express');
const app = express();
const { auth } = require('express-oauth2-jwt-bearer');
const request = require('request-promise-native');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

const privateKeyPath = '/home/anastasiii/Downloads/kpi.pem';
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

async function generateAccessToken(username) {
  const token = jwt.sign({ username }, privateKey, { algorithm: 'RS256' });
  return token;
}

async function authenticateUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
}

app.use(express.json());

app.post('/api/login', async function (req, res) {
  const { login, password } = req.body;

  try {
    const isAuthenticated = await authenticateUser(login, password);

    if (isAuthenticated) {
      const token = await generateAccessToken(login);
      res.json({ token, username: login });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const checkJwt = auth({
  audience: 'https://kpi.eu.auth0.com/api/v2/',
  issuerBaseURL: 'https://kpi.eu.auth0.com/',
});

app.get('/api/private', checkJwt, function (req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.',
    user: req.user
  });
});

async function getToken() {
  const options = {
    method: 'POST',
    url: 'https://kpi.eu.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      client_id: process.env.CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: AUDIENCE,
      grant_type: 'client_credentials',
    },
  };

  try {
    const response = await request(options);
    const parsedBody = JSON.parse(response);
    return parsedBody.access_token;
  } catch (error) {
    throw new Error(error);
  }
}

const publicKeyPath = '/home/anastasiii/Downloads/kpi.pem';
const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');

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

app.use(express.static('public'));

app.listen(3000, function () {
  console.log('Listening on http://localhost:3000');
});
