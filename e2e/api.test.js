const assert = require('assert')
const request = require('supertest')

const app = require('app')
const users = require('users')

describe('GET /api/users/:nickname/exists', () => {
  it('responds with JSON', done => {
    request(app)
      .get('/api/users/nick/exists')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('responds with true when the nickname is taken', () => {
    users.add(1, 'test')

    return request(app)
      .get('/api/users/test/exists')
      .then(({ body }) => {
        assert.strictEqual(body.exists, true)
      })
  })

  it('responds with false when the nickname is not taken', () => {
    return request(app)
      .get('/api/users/available/exists')
      .then(({ body }) => {
        assert.strictEqual(body.exists, false)
      })
  })
})
