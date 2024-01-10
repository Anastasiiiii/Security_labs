const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const onFinished = require("on-finished");
const request = require("request");

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
    const sessionId = uuidv4();
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

const getToken = async () => {
  const options = {
    method: "POST",
    url: "https://kpi.eu.auth0.com/oauth/token",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    form: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: "https://kpi.eu.auth0.com/api/v2/",
      grant_type: "client_credentials",
    },
  };

  try {
    const response = await axios(options);
    console.log("Token Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting token:", error.message);
    throw error;
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
    console.error("Error making request:", error.message);
    throw error;
  }
};


const users = [];

const addUser = async (user) => {
  try {
    const tokenData = await getToken();
    const token = tokenData.access_token;

    const userOptions = {
      method: "POST",
      url: "https://kpi.eu.auth0.com/api/v2/users",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        email: user.email,
        user_id: process.env.CLIENT_ID,
        password: user.password,
        connection: "Username-Password-Authentication",
        user_metadata: {
          username: user.username,
          phone_number: user.phone_number,
        },
      }),
    };

    const response = await makeRequest(userOptions);
    console.log("User is added", response.body);
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error;
  }
};

const loginUser = async (user) => {
  try {
    const tokenOptions = {
      method: "POST",
      url: "https://kpi.eu.auth0.com/oauth/token",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      form: {
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        audience: "https://kpi.eu.auth0.com/api/v2/",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        username: user.username,
        password: user.password,
        scope: "offline_access",
        realm: "Username-Password-Authentication",
      },
    };

    const response = await makeRequest(tokenOptions);
    console.log("Login completed!", response.body);
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    throw error;
  }
};

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
});


app.post("/api/register", async (req, res) => {
  try {
    const { email, password, username, phone_number } = req.body;

    if (!email || !password || !username || !phone_number) {
      return res.status(400).json({ error: "Incomplete registration data" });
    }

    const newUser = {
      email,
      password,
      username,
      phone_number,
    };
    users.push(newUser);

    await addUser(newUser);
    await loginUser(newUser);

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: error.stack,
    });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
