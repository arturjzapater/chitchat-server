const pad = num => num.toString().padStart(2, '0')

const getDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

module.exports = socket => ([event], next) => {
  if (event !== 'user typing') console.log(`${socket.id} ${event} ${getDate()}`)
  next()
}
