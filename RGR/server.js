const crypto = require("crypto");
const net = require('net');
const fs = require('fs');

const options = {
    key: fs.readFileSync('/home/anastasiii/private-key.pem'),
    cert: fs.readFileSync('/home/anastasiii/server-cert.crt'),
    ca: fs.readFileSync('/home/anastasiii/ca-certificate.crt'),
    requestCert: true,
    rejectUnauthorized: true,
};

const server = net.createServer(options, (client) => {
    console.log('Client connected');

    client.on('data', (data) => {
        console.log('Client message:', data.toString());
        const randomMessage = crypto.randomBytes(16).toString('hex');

        client.write(`Random "Hello" message: ${randomMessage}`);
        client.write('Hello from server');
        client.write('Server Certificate:\n');
        client.write(options.cert);  // Send the server's certificate to the client
        client.end();
    });

    client.on('end', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000...');
});
