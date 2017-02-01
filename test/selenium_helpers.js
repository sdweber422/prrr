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

  // browser.checkNumberOfTabs = function() {
  //   return this.getAllWindowHandles()
  //     .then(handles => handles.length < 2)
  // }

  // browser.identifyTabPopup = function() {
  //   return this.checkNumberOfTabs()
  //     .then(condition => {
  //         if (condition){
  //           return new Promise((resolve, reject) => setTimeout(function(){resolve()}, 1000))
  //         }else{
  //           setTimeout(function(){this.identifyTabPopup()}, 100)
  //         }
  //     })
  // }

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
        console.log('URLS', urls)
        if (urls.includes(url)) return true;
        return this.sleep(100)
          .then(_ => this.shouldSeePopupAt(url, timeout-100))
      })
  }

  browser.getTheText = function(textOrClassname){
    const paths = [
      `self::h1[contains(., '${textOrClassname}')]`,
      `self::span[preceding::strong[contains(.,'${textOrClassname}')]]`,
      `self::div[@class='${textOrClassname}']`,
      `self::div[@class='${textOrClassname}']`,
      `self::h2[@class='${textOrClassname}']`
    ]
    // console.log('PATHS_+__+_++_+__++_+_+|_++___+_+__', paths)
    let text = this.wait(until.elementLocated(By.xpath(`//*[${paths[0]} or ${paths[1]} or ${paths[2]} or ${paths[3]} or ${paths[4]}]`)), 2000).getText()
    return text
  }

  browser.getTheValue = function(text){
    let value = this.wait(until.elementLocated(By.className(text)), 2000).getAttribute('value')
    return value
  }

  browser.clickByClassName = function(classname){
    return this.wait(
      until.elementLocated(
        By.className(
          classname)
      ), 2000
    ).click()
  }


  browser.findByXPATH = function(textClassnameValueOrHref){
    const paths = [
      `self::button[contains(.,'${textClassnameValueOrHref}')]`,
      // `self::button[ancestor::h1[contains(.,'${textClassnameValueOrHref}')]]`,
      // `self::span[contains(.,'${textClassnameValueOrHref}')]`,
      `self::input[@value='${textClassnameValueOrHref}']`,
      // `self::button[ancestor::table[@class='${textClassnameValueOrHref}']]`,
      `self::a[contains(.,'${textClassnameValueOrHref}')]`
    ]
    return this.wait(
      until.elementLocated(
        By.xpath(`//*[${paths[0]} or ${paths[1]} or ${paths[2]} or ${paths[3]} or ${paths[4]} or ${paths[5]}]`)
      ), 2000
    )
  }

  browser.clickOn = function(text){
    const paths = [
      // button containing that text
      // a with an href attribute contianing that text
      // input type=submit value=text



      `self::button[contains(.,'${textClassnameValueOrHref}')]`,
      // `self::button[ancestor::h1[contains(.,'${textClassnameValueOrHref}')]]`,
      // `self::span[contains(.,'${textClassnameValueOrHref}')]`,
      `self::input[@value='${textClassnameValueOrHref}']`,
      // `self::button[ancestor::table[@class='${textClassnameValueOrHref}']]`,
      `self::a[contains(.,'${textClassnameValueOrHref}')]`
    ]
    return this.findByXPATH(xpath).click()
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
