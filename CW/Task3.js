//Вільне кодування
const number = "0426";
const name = "Anastasiia Fartushniak";
const email = "nastia262002@gmail.com";

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
const decodedEmailWithURL = decodeURIComponent(encodedEmailWithURL)

console.log("Encoded Number with URL:", encodedNumberWithURL);
console.log("Encoded Name with URL:", encodedNameWithURL);
console.log("Encoded Email with URL:", encodedEmailWithURL);
console.log("Decoded Number with URL:", decodedNumberWithURL);
console.log("Decoded Name with URL:", decodedNameWithURL);
console.log("Decoded Email with URL:", decodedEmailWithURL);