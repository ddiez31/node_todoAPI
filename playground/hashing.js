const {SHA256} = require('crypto-js');

let message = "I am user number 3";
let hash = SHA256(message).toString();


console.log(` Message : ${message}
Hashed message : ${hash}`);
