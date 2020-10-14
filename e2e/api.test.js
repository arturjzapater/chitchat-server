const assert = require('assert')
const request = require('supertest')

const app = require('app')
const users = require('users')
const { decode } = require('utils/token')

describe('POST /api/users', () => {
  beforeEach(() => {
    users.reset()
  })

  it('responds with JSON', done => {
    request(app)
      .post('/api/users/')
      .send({ nickname: 'Nick' })
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('creates new user when nickname is available', () => {
    return request(app)
      .post('/api/users/')
      .send({ nickname: 'Nick' })
      .set('Content-Type', 'application/json')
      .then(() => {
        assert.ok(users.nicknameExists('Nick'))
      })
  })

  it('returns an encrypted token when a new user is generated', () => {
    return request(app)
      .post('/api/users/')
      .send({ nickname: 'Nick' })
      .set('Content-Type', 'application/json')
      .then(({ body: { ok, token } }) => {
        const { nickname } = decode(token)
        assert.ok(ok)
        assert.strictEqual(nickname, 'Nick')
      })
  })

  it('returns not ok when nickname is taken', () => {
    users.add(1, 'Nick')

    return request(app)
      .post('/api/users/')
      .send({ nickname: 'Nick' })
      .set('Content-Type', 'application/json')
      .then(({ body: { ok } }) => {
        assert.ok(!ok)
      })
  })
})
