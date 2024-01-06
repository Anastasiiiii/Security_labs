require("dotenv").config();
const uuid = require("uuid");
const express = require("express");
const onFinished = require("on-finished");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const jwt = require('jsonwebtoken');


//Index imports
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const logoutLink =  document.getElementById("logout");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SESSION_KEY = "Authorization";

class Session {
  #sessions = {};

  constructor() {
    try {
      this.#sessions = fs.readFileSync("./sessions.json", "utf8");
      this.#sessions = JSON.parse(this.#sessions.trim());

      console.log(this.#sessions);
    } catch (e) {
      this.#sessions = {};
    }
  }

  #storeSessions() {
    fs.writeFileSync(
      "./sessions.json",
      JSON.stringify(this.#sessions),
      "utf-8"
    );
  }

  set(key, value) {
    if (!value) {
      value = {};
    }
    this.#sessions[key] = value;
    this.#storeSessions();
  }

  get(key) {
    return this.#sessions[key];
  }

  init(res) {
    const sessionId = uuid.v4();
    this.set(sessionId);

    return sessionId;
  }

  destroy(req, res) {
    const sessionId = req.sessionId;
    delete this.#sessions[sessionId];
    this.#storeSessions();
  }
}

const sessions = new Session();

app.use((req, res, next) => {
  let currentSession = {};
  let sessionId = req.get(SESSION_KEY);

  if (sessionId) {
    currentSession = sessions.get(sessionId);
    if (!currentSession) {
      currentSession = {};
      sessionId = sessions.init(res);
    }
  } else {
    sessionId = sessions.init(res);
  }

  req.session = currentSession;
  req.sessionId = sessionId;

  onFinished(req, () => {
    const currentSession = req.session;
    const sessionId = req.sessionId;
    sessions.set(sessionId, currentSession);
  });

  next();
});

app.get("/", (req, res) => {
  if (req.session.username) {
    return res.json({
      username: req.session.username,
      logout: "http://localhost:3000/logout",
    });
  }
  res.sendFile(path.join(__dirname + "/index.html"));
});

const addUser = async (token, mail, password, username, phone_number) => {
  let userOptions = {
    method: "POST",
    url: "https://kpi.eu.auth0.com/api/v2/users",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    data: JSON.stringify({
      email: mail,
      user_id: process.env.CLIENT_ID,
      password: password,
      connection: "Username-Password-Authentication",
      user_metadata: {
        username,
        phone_number,
      },
    }),
  };
  try {
    const response = await makeRequest(userOptions);
    console.log("User is added", response.body);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const getToken = async () => {
  let options = {
    method: "POST",
    url: "https://kpi.eu.auth0.com/oauth/token",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    form: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: process.env.AUDIENCE,
      grant_type: "client_credentials",
    },
  };
  try {
    const response = await axios(options);
    const data = response.data;
    console.log("Token: ", data.access_token);
    return data;
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
};

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET); // Замініть на власний секретний ключ
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

const makeRequest = async (options) => {
  try {
    const response = await axios(options);
    return {
      response: response,
      body: response.data,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

const users = [
  {
    mail: "mail",
    password: "password",
    username: "username",
    phone_number: "1234567",
  },
  {
    mail: "alice4study@gmail.com",
    password: "D*04i_nA",
    username: "alice4study@gmail.com",
    phone_number: "+380682062222",
  },
];

const loginUser = async (username, password) => {
  const tokenOptions = {
    method: "POST",
    url: `https://kpi.eu.auth0.com/oauth/token`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    form: {
      grant_type: "http://auth0.com/oauth/grant-type/password-realm",
      audience: process.env.AUDIENCE,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      username: username,
      password: password,
      scope: "offline_access",
      realm: "Username-Password-Authentication",
    },
  };

  try {
    const response = await makeRequest(tokenOptions);
    console.log("Login completed!", response.body);
  } catch (error) {
    console.error("Error in loginUser:", error);
  }
};

app.post("/api/createUser", async (req, res) => {
  try {
    const tokenData = await getToken();
    const token = tokenData.access_token;

    await addUser(
      token,
      users[0].mail,
      users[0].password,
      users[0].username,
      users[0].phone_number
    );
    await loginUser(users[0].username, users[0].password);
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem('session');
    location.reload();
});

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const mail = singupForm.mail.value;
    const password = singupForm.password.value;
    const username = singupForm.username.value;
    const phone_number = singupForm.username.value;
    
    addUser(token, mail, password, username, phone_number)
app.post("/api/login", async (req, res) => {
    const tokenData = await getToken();
    const token = tokenData.access_token;

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  const user = await verifyToken(token);

  if (user) {
    req.session.username = user.username;
    req.session.login = user.login;

    return res.json({ token: req.sessionId });
  }

  res.status(401).json({ error: "Invalid token or user credentials" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
})
