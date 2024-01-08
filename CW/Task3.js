const crypto = require("crypto");
// const { RSA } = require('crypto-cz');
// const rsa = new RSA({ bits: 2048 });
const { ReadableStreamDefaultController } = require("node:stream/web");
//Дані для кодування
const number = "0426";
const name = "Anastasiia Fartushniak";
const email = "nastia262002@gmail.com";

console.log("Вільне кодування");
//Вільне кодування
//Кодування даних
const encodedNumber = btoa(number);
const encodedName = btoa(name);
const encodedEmail = btoa(email);

//Декодування даних
const decodedNumber = atob(encodedNumber);
const decodedName = atob(encodedName);
const decodedEmail = atob(encodedEmail);

console.log("Encoded Number:", encodedNumber);
console.log("Encoded Name:", encodedName);
console.log("Encoded Email:", encodedEmail);
console.log("Decoded Number:", decodedNumber);
console.log("Decoded Name:", decodedName);
console.log("Decoded Email:", decodedEmail);

//Вільне кодування/декодування за допомогою  URL
//кодування
const encodedNumberWithURL = encodeURIComponent(number);
const encodedNameWithURL = encodeURIComponent(name);
const encodedEmailWithURL = encodeURIComponent(email);

//декодування
const decodedNumberWithURL = decodeURIComponent(encodedNumberWithURL);
const decodedNameWithURL = decodeURIComponent(encodedNameWithURL);
const decodedEmailWithURL = decodeURIComponent(encodedEmailWithURL);

console.log("Encoded Number with URL:", encodedNumberWithURL);
console.log("Encoded Name with URL:", encodedNameWithURL);
console.log("Encoded Email with URL:", encodedEmailWithURL);
console.log("Decoded Number with URL:", decodedNumberWithURL);
console.log("Decoded Name with URL:", decodedNameWithURL);
console.log("Decoded Email with URL:", decodedEmailWithURL);

//Симетричний алгоритм шифрування
console.log("Симетричне кодування");

const generateKey = () => {
  return crypto.randomBytes(16);
};

const encryptAES = (data, key) => {
  const cipher = crypto.createCipheriv("aes-128-cbc", key, Buffer.alloc(16));
  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decryptAES = (encryptedData, key) => {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    key,
    Buffer.alloc(16)
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

const key = generateKey();
console.log("Ключ: ", key);

const encryptedNumberWithKey = encryptAES(number, key);
const encryptedNameWithKey = encryptAES(name, key);
const encryptedEmailWithKey = encryptAES(email, key);

const decpyptedNumberWithKey = decryptAES(encryptedNumberWithKey, key);
const decpyptedNameWithKey = decryptAES(encryptedNameWithKey, key);
const decpyptedEmailWithKey = decryptAES(encryptedEmailWithKey, key);

console.log("Encrypted Number with a Key:", encryptedNumberWithKey);
console.log("Encrypted Name with a Key:", encryptedNameWithKey);
console.log("Encrypted Email with a Key:", encryptedEmailWithKey);

console.log("Decpypted Number with a Key:", decpyptedNumberWithKey);
console.log("Decpypted Name with a Key:", decpyptedNameWithKey);
console.log("Decpypted Email with a Key:", decpyptedEmailWithKey);

//Асиметричний алгоритм шифрування даних.
console.log("Асиметричне кодування");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

console.log("Public key: ", publicKey);
console.log("Private key: ", privateKey);

const encryptedRSA = (data, key) => {
  const encrypted = crypto.publicEncrypt(
    {
      key: key,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(data, "utf-8")
  );
  return encrypted;
};

const encryptedNumber = encryptedRSA(number, publicKey);
const encryptedName = encryptedRSA(name, publicKey);
const encryptedEmail = encryptedRSA(email, publicKey);

console.log("Encrypted Number: ", encryptedNumber.toString("base64"));
console.log("Encrypted Name: ", encryptedName.toString("base64"));
console.log("Encrypted Email: ", encryptedEmail.toString("base64"));

const decryptedRSA = (data, key) => {
  const decrypted = crypto.privateDecrypt(
    {
      key: key,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(data, "utf-8")
  );
  return decrypted
};

const decryptedNumber = decryptedRSA(encryptedNumber, privateKey);
const decryptedName = decryptedRSA(encryptedName, privateKey);
const decryptedEmail = decryptedRSA(encryptedEmail, privateKey);

console.log("Decrypted Number: ", decryptedNumber.toString());
console.log("Decrypted Name: ", decryptedName.toString());
console.log("Decrypted Email: ", decryptedEmail.toString());