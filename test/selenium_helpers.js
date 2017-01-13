import webdriver from 'selenium-webdriver'
import path from 'path'
import fs from 'fs'
const ARTIFACTS_PATH = path.resolve(__dirname, '../../tmp/artifacts')

const { By, until } = webdriver
export { By, until }

export const usingSelenium = (callback) => {
  context('usingSelenium', () => {
    beforeEach(setupSelenium)
    afterEach(tearDownSelenium)
    callback()
  })
}

const setupSelenium = function(done) {
  this.serverInstance = server.start(3781, () => {
  this.browser = new webdriver.Builder()
    .forBrowser('chrome')
    .build()

  this.browser.visit = (path) => {
    return this.browser.get('http://localhost:3781' + path)
  }

  this.takeScreenshot = () => {
    return this.browser.takeScreenshot()
      .then(function(image, error) {
        const fileName = path.resolve(ARTIFACTS_PATH, `screenshot-${new Date().valueOf()}.png`)
        fs.writeFile(fileName, image, 'base64', function(error){
          if(error) throw error
        })
      })
    }

  this.getLogs = () => {
    return this.browser.manage().logs().get('browser')
      .then(logs => console.log('Browser Logs:', logs))
  }

  this.loginAs = loginAs
  done()
  })
}

const tearDownSelenium = function(done) {
  if (this.browser) this.browser.quit()
  if (this.serverInstance) this.serverInstance.close(done)
}

const loginAs = function(githubId) {
  return this.browser.visit(`/__login/${githubId}`)
  .then(session => {
    const body = this.browser.findElement(By.css('body'), 2000)
    return this.browser.wait(until.elementTextContains(body, `logged in as ${githubId}`), 5000)
  })
}
