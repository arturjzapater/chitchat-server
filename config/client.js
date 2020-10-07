module.exports = {
  url: process.env.NODE_ENV === 'production'
    ? 'https://chitchat-client.netlify.app'
    : 'http://localhost:3000'
}
