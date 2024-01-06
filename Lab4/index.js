const uuid = require('uuid');
const express = require('express');
const onFinished = require('on-finished');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SESSION_KEY = 'Authorization';

class Session {
    #sessions = {}

    constructor() {
        try {
            this.#sessions = fs.readFileSync('./sessions.json', 'utf8');
            this.#sessions = JSON.parse(this.#sessions.trim());

            console.log(this.#sessions);
        } catch(e) {
            this.#sessions = {};
        }
    }

    #storeSessions() {
        fs.writeFileSync('./sessions.json', JSON.stringify(this.#sessions), 'utf-8');
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

app.get('/', (req, res) => {
    if (req.session.username) {
        return res.json({
            username: req.session.username,
            logout: 'http://localhost:3000/logout'
        })
    }
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/logout', (req, res) => {
    sessions.destroy(req, res);
    res.redirect('/');
});

const addUser = async (token, mail, user_id, password, username, phone_number) => {
    let userOptions = {
        method: 'POST',
        headers: userHeaders,  
        body: JSON.stringify({
            email: mail,  
            user_id: user_id,
            password: password,
            connection: "Username-Password-Authentication",
            authorization: `Bearer ${token}`,
            user_metadata: {
                username,
                phone_number
            }
        })
    };
    try {
        const response = await makeRequest(userOptions);
        console.log('User is added', response.body);
    } catch (error) {
        console.error('error', error);
    }
}

const getToken= async (client_id, client_secret, audience) => {
    let options = {
        method: 'POST',
        url: 'https://kpi.eu.auth0.com/oauth/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
          client_id: client_id,
          client_secret: client_secret,
          audience: audience,
          grant_type: 'client_credentials'
        }
    }
    try {
        const response = await makeRequest(userOptions);
        console.log('Client`s token is ', response.body);
    } catch {
        console.error('error', error);
    }
}

const refreshToken = async (client_id, client_secret, refresh_token) => {
    let options = {
        method: "POST",
        url: "https://kpi.eu.auth0.com/oauth/token",
        headers: { "content-type": "application/x-www-form-urlencoded"},
        form: {
          client_id: client_id,
          client_secret: client_secret,
          refresh_token: refresh_token,
          grant_type: "refresh_token",
        },
      }
      try {
        const response = await makeRequest(userOptions);
        console.log('The refreshed token is  ', response.body);
    } catch {
        console.error('error', error);
    } 
}

// const users = [
//     {
//         login: 'Login',
//         password: 'Password',
//         username: 'Username',
//     },
//     {
//         login: 'Login1',
//         password: 'Password1',
//         username: 'Username1',
//     }
// ]

app.post('/api/createUser', async (req, res) => {
    const { token, mail, user_id, password, username, phone_number } = req.body;
    addUser()
    try {
        await createUser(token, mail, user_id, password, username, phone_number);
        return res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})