const assert = require('assert')
const io = require('socket.io-client')

describe('Sockets join event', () => {
  let socket

  beforeEach(done => {
    socket = io('http://localhost:5000/socket', {
      reconnectionDelay: 0,
      forceNew: true
    })

    socket.on('connect', () => {
      done()
    })
  })

  afterEach(done => {
    if (socket.connected) {
      socket.close()
      done()
    }
  })

  it('should respond to join events with an updated userlist', done => {
    socket.on('update userlist', payload => {
      const user = payload.find(x => x.nickname === 'Test')

      assert.ok(user)
      done()
    })

    socket.emit('join', 'Test')
  })

  it('should respond to join events with a new message', done => {
    socket.on('new message', payload => {
      assert.strictEqual(payload.user, 'Test')
      assert.strictEqual(payload.text, 'joined the conversation.')
      assert.strictEqual(payload.type, 'system')
      assert.ok(typeof payload.timestamp === 'number')
      done()
    })

    socket.emit('join', 'Test')
  })
})

describe('Sockets other events', () => {
  let socket

  beforeEach(done => {
    socket = io('http://localhost:5000/socket', {
      reconnectionDelay: 0,
      forceNew: true
    })

    socket.on('connect', () => {
      socket.emit('join', 'Test')
      socket.on('new message', () => {
        socket.off('new message')
        done()
      })
    })
  })

  afterEach(done => {
    if (socket.connected) {
      socket.close()
      done()
    }
  })

  it('should respond to new message with a new message', done => {
    socket.on('new message', payload => {
      assert.strictEqual(payload.user, 'Test')
      assert.strictEqual(payload.text, 'test message')
      assert.strictEqual(payload.type, 'user')
      done()
    })

    socket.emit('new message', 'test message')
  })

  it('should respond to user typing with updated user list', done => {
    socket.on('update userlist', payload => {
      const user = payload.find(x => x.nickname === 'Test')

      assert.strictEqual(user.isTyping, true)
      done()
    })

    socket.emit('user typing', true)
  })
})
