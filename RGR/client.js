const net = require('net');
const fs = require('fs');
const crypto = require('crypto');

const options = {
    key: fs.readFileSync('/home/anastasiii/private-key.pem'),
    cert: fs.readFileSync('/home/anastasiii/client-cert.crt'),  // Use the client certificate here
    ca: fs.readFileSync('/home/anastasiii/ca-certificate.crt'),
};

const client = net.createConnection({ port: 3000 }, () => {
    console.log('Connected to server');
    
    client.write('Hello from client');
});

client.on('data', (data) => {
    console.log('Server response:', data.toString());

    const serverCert = options.ca;
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(data);

    if (verifier.verify(serverCert, data.toString('base64'), 'base64')) {
        console.log('Server certificate verification successful!');

        const serverCertInfo = crypto.X509Certificate.fromPEM(data);  // Use the received certificate data
        const currentTimestamp = Date.now();
        const expirationTimestamp = Date.parse(serverCertInfo.validTo);

        if (currentTimestamp < expirationTimestamp) {
            console.log('Server certificate is still valid.');
        } else {
            console.log('Server certificate has expired.');
        }
    } else {
        console.log('Server certificate verification failed!');
       // console.error(verifier.getError());
    }

    client.end();
});

client.on('end', () => {
    console.log('Disconnected from server');
});
