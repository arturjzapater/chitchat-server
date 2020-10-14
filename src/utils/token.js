const jwt = require('jwt-simple')

const { TOKEN_SECRET = '123123' } = process.env

const decode = token => jwt.decode(token, TOKEN_SECRET)
const encode = payload => jwt.encode(payload, TOKEN_SECRET)

module.exports = {
  decode,
  encode
}
