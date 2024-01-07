const crypto = require("crypto");
//Дані для кодування
const number = "0426";
const name = "Anastasiia Fartushniak";
const email = "nastia262002@gmail.com";

console.log("Вільне кодування")
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

console.log("Симетричне кодування")
//Симетричне кодування
const generateKey = () => {
  return crypto.randomBytes(16);
};

const encryptIDEA = (data, key) => {
  const cipher = crypto.createCipheriv("idea-ecb", key, Buffer.alloc(0));
  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decryptIDEA = (encryptedData, key) => {
  const decipher = crypto.createDecipheriv("idea-ecb", key, Buffer.alloc(0));
  let decrypted = decipher.update(encryptedData, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

const key = generateRandomIDEAKey();

const encodedNumberWithKey = encryptIDEA(number, key);
const encodedNameWithKey = encryptIDEA(name, key);
const encodedEmailWithKey = encryptIDEA(email, key);

const decodedNumberWithKey = decryptIDEA(encodedNumberWithKey, key);
const decodedNameWithKey = decryptIDEA(encodedNameWithKey, key);
const decodedEmailWithKey = decryptIDEA(encodedEmailWithKey, key);

console.log(encodedNumberWithKey);
console.log(encodedNameWithKey);
console.log(encodedEmailWithKey);

console.log(decodedNumberWithKey);
console.log(decodedNameWithKey);
console.log(decodedEmailWithKey);