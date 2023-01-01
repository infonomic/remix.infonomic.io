const crypto = require('crypto')
const getRandomString = length => crypto.randomBytes(length).toString('hex')
const secret = getRandomString(16)
console.log(secret)
