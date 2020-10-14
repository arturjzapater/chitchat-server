const assert = require('assert')
const http = require('http')
const io = require('socket.io-client')

const opts = {
  host: 'localhost',
  port: 5000,
  path: '/api/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

const request = callback => {
  const req = http.request(opts, res => {
    let data = ''
    res.on('data', chunk => {
      data += chunk
    })
    res.on('end', () => {
      const body = JSON.parse(data)
      if (!body.ok) throw new Error(body.reason)
      callback(body.token)
    })
  })

  req.write(JSON.stringify({ nickname: 'Test' }))
  req.end()
}

describe('Socket connection', () => {
  let socket

  beforeEach(() => new Promise(resolve => {
    request(token => {
      socket = io('http://localhost:5000/socket', {
        reconnectionDelay: 0,
        forceNew: true,
        query: { token }
      })

      resolve()
    })
  }))

  afterEach(() => new Promise(resolve => {
    if (socket.connected) socket.close()
    resolve()
  }))

  it('should respond to connection with a new system message', () => {
    return new Promise(resolve => {
      socket.on('connect', () => {
        socket.on('new message', payload => {
          assert.strictEqual(payload.user, 'Test')
          assert.strictEqual(payload.text, 'joined the conversation.')
          assert.strictEqual(payload.type, 'system')
          assert.ok(typeof payload.timestamp === 'number')
          resolve(socket)
        })
      })
    })
  })

  it('should respond to connection with an updated user list', () => {
    return new Promise(resolve => {
      socket.on('connect', () => {
        socket.on('update userlist', payload => {
          const user = payload.find(x => x.nickname === 'Test')

          assert.ok(user)
          resolve()
        })
      })
    })
  })
})

describe('Socket events', () => {
  let socket

  beforeEach(() => new Promise(resolve => {
    return request(token => {
      socket = io('http://localhost:5000/socket', {
        reconnectionDelay: 0,
        forceNew: true,
        query: { token }
      })

      socket.on('connect', () => {
        socket.on('new message', () => {
          socket.off('new message')
          resolve()
        })
      })
    })
  }))

  afterEach(() => new Promise(resolve => {
    if (socket.connected) socket.close()
    resolve()
  }))

  it('should respond to new message with a new message', () => {
    return new Promise(resolve => {
      socket.on('new message', payload => {
        assert.strictEqual(payload.user, 'Test')
        assert.strictEqual(payload.text, 'test message')
        assert.strictEqual(payload.type, 'user')
        resolve()
      })

      socket.emit('new message', 'test message')
    })
  })

  it('should respond to user typing with updated user list', () => {
    return new Promise(resolve => {
      socket.on('update userlist', payload => {
        const user = payload.find(x => x.nickname === 'Test')

        assert.strictEqual(user.isTyping, true)
        resolve()
      })

      socket.emit('user typing')
    })
  })
})
