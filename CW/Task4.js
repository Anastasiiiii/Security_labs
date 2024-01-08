const { v1, v3, v4, v5 } = require('uuid');

const uuidV1 = v1(); 
const uuidV3 = v3('google.com', v4()); 
const uuidV4 = v4(); 
const uuidV5 = v5('google.com', v4()); 

console.log('UUID v1:', uuidV1);
console.log('UUID v3:', uuidV3);
console.log('UUID v4:', uuidV4);
console.log('UUID v5:', uuidV5);

function generateUUIDv2() {
    const uuidTime = (new Date().getTime() * 10000) + 122192928000000000;
    const uuidClockSeq = Math.floor(Math.random() * 16384);
    const uuidNode = Math.floor(Math.random() * 256);

    return (
        (uuidTime & 0xFFFFFFFFFFFF0000) |
        ((uuidTime & 0x0000000000000FFF) << 48) |
        (0x2000) |
        (uuidClockSeq << 32) |
        (uuidNode << 24)
    ).toString(16);

}
const uuidV2 = generateUUIDv2();
console.log('UUID v2:', uuidV2);

