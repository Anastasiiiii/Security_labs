const tls = require('tls');
const fs = require('fs');
const crypto = require('crypto');

const options = {
    key: fs.readFileSync('/home/anastasiii/private-key.pem'),
    cert: fs.readFileSync('/home/anastasiii/client-csr.pem'),
    ca: fs.readFileSync('/home/anastasiii/ca-certificate.crt'),
};

const premasterSecret = crypto.randomBytes(48);

const client = tls.connect(3000, options, () => {
    console.log('Connected to server');

    // Відправляємо привітання серверу
    client.write('Hello from client');
});

client.on('data', (data) => {
    console.log('Server response:', data.toString());

    const serverCert = options.ca;
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(data);

    if (verifier.verify(serverCert, data.toString('base64'), 'base64')) {
        console.log('Server certificate verification successful!');

        const serverCertInfo = crypto.X509Certificate.fromPEM(data);
        const currentTimestamp = Date.now();
        const expirationTimestamp = Date.parse(serverCertInfo.validTo);

        if (currentTimestamp < expirationTimestamp) {
            console.log('Server certificate is still valid.');
        } else {
            console.log('Server certificate has expired.');
        }
    } else {
        console.log('Server certificate verification failed!');
    }

    // Відправляємо premaster_secret на сервер
    client.write(premasterSecret);

    // Завершуємо з'єднання після відправлення premaster_secret
    client.end();
});

client.on('end', () => {
    console.log('Disconnected from server');
});
