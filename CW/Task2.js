const jwt = require('jsonwebtoken');
const moment = require('moment');

const examDateTime = new Date('2024-01-12T00:00:00Z');
const examTimeUnix = Math.floor(examDateTime.getTime() / 1000);

console.log("Час іспиту:", examTimeUnix);

const newYearDate = new Date('2024-01-01');
const birthdayDate = new Date('2024-09-26');

const newYearTimeStamp = Math.floor(newYearDate.getTime() / 1000);
const birthdayTimeStamp = Math.floor(birthdayDate.getTime() / 1000);

const timeDiffSeconds = birthdayTimeStamp - newYearTimeStamp;

const daysDifference = Math.floor(timeDiffSeconds / (24 * 60 * 60));

console.log("Кількість днів до дня народження з початку року: ", daysDifference);

const name = "Anastasiia Fartushniak";
const sub = "nastia262002@gmail.com";
const campusExamTime = examDateTime;
const daysUntilBirthday = daysDifference;
const examTimeAndDaysUntilBirthday = moment.unix(campusExamTime).add(daysUntilBirthday, 'days');
const examTimeAndDaysUntilBirthdayUnix = examTimeAndDaysUntilBirthday.unix();

const claims = {
    name: name,
    sub: sub,
    iat: moment().unix(),
    exp: examTimeAndDaysUntilBirthdayUnix,
    nbf: campusExamTime
}

console.log(claims);
