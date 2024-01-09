const net = require('net');

const client = net.createConnection({ port: 3000 }, () => {
    console.log('Connected to server');
    
    // Sending client hello message
    client.write('Hello from client');
});

client.on('data', (data) => {
    console.log('Server response:', data.toString());
    client.end();
});

client.on('end', () => {
    console.log('Disconnected from server');
});
