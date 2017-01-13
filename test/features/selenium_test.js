import { usingSelenium, By, until } from '../selenium_helpers'
import { withUsersInTheDatabase } from '../helpers'

describe('going to the homepage', () => {
  withUsersInTheDatabase(() => {
    usingSelenium(() => {
      describe('not logged in', () => {
        it('goes to the homepage', function(done) {
          this.timeout(10000)
          this.browser.visit('/')
          this.browser.wait(until.elementLocated(By.css('a[href="/login"]')), 2000).click()
          this.browser.wait(until.elementLocated(By.className('octicon-mark-github')), 2000)
          this.browser.then(_ => done())
        })
      })
      describe('while logged in', () => {
        beforeEach(function(){
          this.timeout(10000)
          return this.loginAs(123456)
        })
        it('goes to the logged-in homepage and then logs out', function(done) {
          this.timeout(10000)
          this.browser.visit('/')
          this.browser.sleep(1000)
          this.browser.wait(until.elementLocated(By.className('Navbar-button-logout')), 2000).click()
          this.browser.wait(until.elementLocated(By.css('a[href="/login"]')), 2000)
          this.browser.then(_ => done())
        })
      })
    })
  })
})
