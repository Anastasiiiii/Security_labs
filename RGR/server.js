const crypto = require("crypto");
const net = require('net');
const fs = require('fs');

const server = net.createServer((client) => {
    console.log('Client connected');

    // Handling client hello message
    client.on('data', (data) => {
        console.log('Client message:', data.toString());
        const randomMessage = crypto.randomBytes(16).toString('hex');

        client.write(`Random "Hello" message: ${randomMessage}`);
        client.write('Hello from server');
        client.end();
    });

    client.on('end', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000...');
});
