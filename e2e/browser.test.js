const assert = require('assert')
const puppeteer = require('puppeteer')

describe('Login page', function () {
  this.timeout(8000)
  let browser
  let page

  before(async () => {
    browser = await puppeteer.launch()
  })
  after(() => browser.close())

  beforeEach(async () => {
    page = await browser.newPage()
    await page.goto('http://localhost:3000')
  })
  afterEach(() => page.close())

  it('should show a connect form', () => {
    return page.waitForSelector('form')
      .then(() => {
        assert.ok(true)
      })
  })

  it('should allow a user to connect to the chat', () => {
    return page.waitForSelector('#login-form input')
      .then(input => input.type('Test User'))
      .then(() => page.keyboard.press('Enter'))
      .then(() => page.waitForNavigation())
      .then(() => {
        assert.match(page.url(), /\/chatroom\/?$/)
      })
  })

  it('should not allow a user to connect without a nickname', () => {
    return page.waitForSelector('#login-form button')
      .then(button => button.click())
      .then(() => page.waitForSelector('#login-form span.text-red-500'))
      .then(() => page.$eval('#login-form span.text-red-500', span => span.innerText))
      .then(text => {
        assert.strictEqual(text, 'Please, fill this field.')
      })
  })

  it('should not allow a user to connect with an existing nickname', async () => {
    const page2 = await browser.newPage()

    const login = page => page.goto('http://localhost:3000')
      .then(() => page.waitForSelector('#login-form input'))
      .then(input => input.type('Test User'))
      .then(() => page.keyboard.press('Enter'))

    return login(page)
      .then(() => login(page2))
      .then(() => page2.waitForSelector('#info-section p'))
      .then(() => page2.$eval('#info-section p', p => p.innerText))
      .then(text => {
        assert.strictEqual(text, 'Failed to connect. Nickname already taken.')
      })
      .finally(() => page2.close())
  })
})

describe('Chatroom page', function () {
  this.timeout(8000)
  let browser
  let page

  before(async () => {
    browser = await puppeteer.launch()
  })
  after(() => browser.close())

  beforeEach(async () => {
    page = await browser.newPage()
    await page.goto('http://localhost:3000')
      .then(() => page.waitForSelector('#login-form input'))
      .then(input => input.type('Test User'))
      .then(() => page.keyboard.press('Enter'))
      .then(() => page.waitForNavigation())
  })
  afterEach(() => page.close())

  it('should show a form to send messages', () => {
    return page.waitForSelector('#new-msg-form')
      .then(() => {
        assert.ok(true)
      })
  })

  it('should show the list of participants', () => {
    return page.waitForSelector('#user-list li')
      .then(() => page.$$eval('#user-list li', li => li.map(x => x.innerText)))
      .then(list => {
        const testUserExists = list.includes('Test User')

        assert.ok(testUserExists)
      })
  })

  it('should allow participants to send messages', () => {
    return page.waitForSelector('#new-msg-form input')
      .then(input => input.type('Test message.'))
      .then(() => page.keyboard.press('Enter'))
      .then(() => page.waitForSelector('article.message p'))
      .then(() => page.$$eval('article.message p', list => list.map(a => a.innerText)))
      .then(list => {
        const sentMessageExists = list.includes('Test message.')

        assert.ok(sentMessageExists)
      })
  })
})
