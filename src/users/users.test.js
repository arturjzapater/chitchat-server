const assert = require('assert')
const users = require('./index')

describe('users module', () => {
  beforeEach(() => {
    users.reset()
    users.add(1, 'Julia')
    users.add(2, 'Clara')
    users.add(3, 'Claudia')
  })

  describe('add', () => {
    it('adds a user to the list', () => {
      users.add(4, 'Nick')
      const nick = users.list().find(x => x.nickname === 'Nick')

      assert.strictEqual(users.list().length, 4)
      assert.strictEqual(nick.id, 4)
      assert.strictEqual(nick.nickname, 'Nick')
      assert.strictEqual(nick.isTyping, false)
    })

    it('returns the new user\'s id', () => {
      const id = users.add(4, 'Test')

      assert.strictEqual(id, 4)
    })
  })

  describe('remove', () => {
    it('removes a user from the list', () => {
      users.remove(1)
      const list = users.list()
      const julia = list.find(x => x.id === 1)

      assert.strictEqual(list.length, 2)
      assert.strictEqual(julia, undefined)
    })

    it('doesn\'t do anything if the user doesn\'t exist', () => {
      users.remove(4)

      assert.strictEqual(users.list().length, 3)
    })
  })

  describe('list', () => {
    it('returns all the users in the list', () => {
      assert.strictEqual(users.list().length, 3)
    })
  })

  describe('nicknameExists', () => {
    it('returns true if the nickname is already taken', () => {
      assert.strictEqual(users.nicknameExists('Clara'), true)
    })

    it('returns false if the nickname doesn\' exist', () => {
      assert.strictEqual(users.nicknameExists('Julian'), false)
    })
  })

  describe('update', () => {
    it('updates a user', () => {
      users.update(1, { isTyping: true })
      const julia = users.list().find(x => x.nickname === 'Julia')

      assert.strictEqual(julia.isTyping, true)
    })
  })
})
