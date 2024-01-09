const tls = require('tls');
const fs = require('fs');
const crypto = require('crypto');

const options = {
    key: fs.readFileSync('/home/anastasiii/private-key.pem'),
    cert: fs.readFileSync('/home/anastasiii/server-cert.crt'),
    ca: fs.readFileSync('/home/anastasiii/ca-certificate.crt'),
    requestCert: true,
    rejectUnauthorized: true,
};

const server = tls.createServer(options, (cleartextStream) => {
    console.log('Client connected');

    cleartextStream.on('data', (data) => {
        console.log('Client message:', data.toString());

        const premasterSecret = crypto.randomBytes(48);

        const randomMessage = crypto.randomBytes(16).toString('hex');
        cleartextStream.write(`Random "Hello" message: ${randomMessage}`);
        cleartextStream.write('Hello from server');
        cleartextStream.write('Server Certificate:\n');
        cleartextStream.write(options.cert);
        cleartextStream.end();
    });

    cleartextStream.on('end', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000...');
});
