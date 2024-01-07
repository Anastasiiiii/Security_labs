const username = "Fartushniak";
const password = "0426";

const credentials = `${username}:${password}`;
const credentialsBase64 = btoa(credentials);

const authorizationHeader = `Basic ${credentialsBase64}`;

console.log("Authorization Header:", authorizationHeader);
