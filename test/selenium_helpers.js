import webdriver from 'selenium-webdriver'
import path from 'path'
import fs from 'fs'

const ARTIFACTS_PATH = path.resolve(__dirname, '../../tmp/artifacts')
const PORT = 3781

const { By, until } = webdriver
export { By, until }

const withServer = function(done){
  this.serverInstance = server.start(PORT, done)
}

const Browser = function(){
  const browser = new webdriver.Builder()
    .forBrowser('chrome')
    .build()

  browser.visit = function(path){
    return this.get(`http://localhost:${PORT}${path}`)
  }

  browser.saveScreenshot = function(){
    return this.takeScreenshot()
      .then(function(image, error) {
        const fileName = path.resolve(ARTIFACTS_PATH, `screenshot-${new Date().valueOf()}.png`)
        fs.writeFile(fileName, image, 'base64', function(error){
          if(error) throw error
        })
      })
    }

  browser.getLogs = function(){
    return this.manage().logs().get('browser')
      .then(logs => console.log('Browser Logs:', logs))
  }

  browser.loginAs = function(githubId) {
    return this.visit(`/__login/${githubId}`)
    .then(session => {
      const body = this.findElement(By.css('body'), 2000)
      return this.wait(
        until.elementTextContains(body, `logged in as ${githubId}`),
        5000
      )
    })
  }

  browser.closeTabs = function(){
    return this.getAllWindowHandles()
      .then(handles => {
        for(let i = handles.length -1; i > 0; i--){
          this.switchTo().window(handles[i])
          this.close()
        }
        this.switchTo().window(handles[0])
      })
  }

  browser.checkNumberOfTabs = function() {
    return this.getAllWindowHandles()
      .then(handles => handles.length < 2)
  }

  browser.identifyTabPopup = function(timeout=2000) {
    if(timeout <= 0) throw new Error('Out of time')
    const _this = this
    return this.checkNumberOfTabs()
      .then(condition => {
          if (condition) return Promise.resolve()
          else{
            setTimeout(function(){_this.identifyTabPopup(timeout-100)}, 100)
          }
      })
  }

  browser.shouldSee = function(text, timeout=2000){
    const body = this.findElement(By.css('body'));
    return this.wait(until.elementTextContains(body, text), timeout)
      .catch(error => {
        throw new Error(`expected page to contain text: ${JSON.stringify(text)}`)
      })
  }

  browser.shouldSeeWithin = function(text, element, timeout=2000){
    return this.wait(until.elementTextContains(this.findElement(element), text), timeout)
      .catch(error => {
        throw new Error(`expected ${element} to contain text: ${JSON.stringify(text)}`)
      })
  }

  browser.shouldNotSeeWithin = function(text, element, timeout=2000){
    return this.wait(until.elementTextContains(this.findElement(element), text), timeout)
    .then(function(error) { if(error) throw new Error(`${text} exists on the page and therefore fails this test`)}, function (result) {
      if(result) {
        Promise.resolve()
      }
    })
  }

  browser.getWindowUrls = function(){
    return this.getAllWindowHandles().then(windows => {
      const urls = windows.map(windowHandle => {
        this.switchTo().window(windowHandle)
        return this.getCurrentUrl()
      })
      return Promise.all(urls)
    })
  }

  browser.shouldSeePopupAt = function(url, timeout=2000){
    if (timeout <= 0) throw new Error(`failed to find popup at ${url}`)
    return this.getWindowUrls()
      .then(urls => {
        if (urls.includes(url)) return true;
        return this.sleep(100)
          .then(_ => this.shouldSeePopupAt(url, timeout-100))
      })
  }

  browser.clickOn = function(text){
    const paths = [
      `self::button[contains(.,'${text}')]`,
      `self::input[@value='${text}']`,
      `self::a[(contains(.,'${text}')) and (@href)]`
    ]
    return this.wait(
      until.elementLocated(
        By.xpath(`//*[${paths.join(' or ')}]`)
      ), 2000
    ).click()
  }

  browser.archiveMyRequestedPrrr = function(pullRequestText, element){
    return this.wait(until.elementLocated(element))
      .then(table => table.findElement(By.xpath(`//tr[contains(.,'${pullRequestText}')]`)))
      .then(tr => tr.findElement(By.className('ArchivePrrrButton')))
      .then(archivePrrrButton => archivePrrrButton.click())
  }

  browser.insertPullRequestAddress = function(pullRequestText, element){
    return this.wait(until.elementLocated(element), 2000).sendKeys(pullRequestText)
      .catch(error => {throw new Error('No element found with that css selector')})
  }

  return browser
}


export const usingSelenium = function(callback){
  context('usingSelenium', () => {
    beforeEach(setupSelenium)
    afterEach(tearDownSelenium)
    callback()
  })
}


const setupSelenium = function(done) {
  this.browsers = []
  this.createBrowser = function(position){
    const browser = Browser()
    if (position === 'right') browser.manage().window().setPosition(950, 0)
    browser.manage().window().setSize(1600, 1200)
    this.browsers.push(browser)
    return browser
  }
  this.waitForAllBrowsers = () => {
    console.log('waiting for all browsers to complete')
    const promises = this.browsers.map(browser =>
      browser.then(x => {
        console.log('browser done', x)
        return x
      })
    )
    return Promise.all(promises).then(results => {
      console.log('all browsers complete', {results})
    })
  }
  withServer.call(this, _ => done())
}

const tearDownSelenium = function(done) {
  if (this.browsers) this.browsers.forEach(browser => browser.quit())
  if (this.serverInstance) this.serverInstance.close(done)
}
