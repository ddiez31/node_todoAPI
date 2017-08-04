const {SHA256} = require('crypto-js');

// // This illustrates the principle of JWT
// // (JSON web token)
//
// let message = "I am user number 3";
// let hash = SHA256(message).toString();
//
// console.log(` Message : ${message}
//   Hashed message : ${hash}`);
//
//
//   let data = {
//     id: 4
//   };
//   let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secret').toString()
//   };
//
//   let resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();
//
//   if (resultHash === token.hash){
//     console.log('Data was not changed.')
//   } else {
//     console.log('Data was changed!');
//   }
//
//   // if imposter modifies data.id and rehashes it,
//   // it will fail because of the salt ('secret').

// Now with the dedicated library
const jwt = require('jsonwebtoken');

let data = {
  id: 10
};

let token = jwt.sign(data, '123abc');
console.log(token);
// This token can be verified on https://jwt.io/

var decoded = jwt.verify(token, '123abc');
console.log('Decoded', decoded);
