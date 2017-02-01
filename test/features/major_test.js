import webdriver from 'selenium-webdriver'
import { usingSelenium, By, until } from '../selenium_helpers'
import { withUsersInTheDatabase } from '../helpers'

describe.only('selenium scenarios', function(){
  usingSelenium(function(){

    withUsersInTheDatabase(function(){
      it('runs through scenario of a player creating a prrr and a coach seeing a new prrr being added and claims it', function(){
        this.timeout(60*10000)

        const player = this.createBrowser()
        const coach = this.createBrowser('right')

        sinon.stub(Queries.prototype, "getPullRequest").returns(Promise.resolve({FAKE_PR: true}));

        return Promise.resolve()
        //Create initial state for testing
          .then(_ => {
            return knex
            .table('pull_request_review_requests')
            .insert(
              [
                {
                  owner: 'AbrahamFergie',
                  repo: 'Archive.com',
                  number: 46,
                  requested_by: 'AbrahamFergie',
                  created_at: '2017-01-18 15:29:22.979-08',
                  updated_at: '2017-01-18 15:29:22.979-08'
                },
                {
                  owner: 'AbrahamFergie',
                  repo: 'hibbityDibbity.com',
                  number: 42,
                  requested_by: 'countChocula',
                  created_at: '2017-01-18 15:29:22.979-08',
                  updated_at: '2017-01-18 15:29:22.979-08'
                },
                {
                  owner: 'AbrahamFergie',
                  repo: 'bloodThirsty.com',
                  number: 41,
                  requested_by: 'AbrahamFergie',
                  claimed_by: 'countChocula',
                  claimed_at: '2017-01-18 16:29:22.979-08',
                  created_at: '2017-01-18 15:29:22.979-08',
                  updated_at: '2017-01-18 15:29:22.979-08',
                  completed_at: '2017-01-18 17:28:22.979-08'
                },
                {
                  owner: 'AbrahamFergie',
                  repo: 'bloodThirsty.com',
                  number: 44,
                  requested_by: 'AbrahamFergie',
                  created_at: '2017-01-18 15:29:22.979-08',
                  updated_at: '2017-01-18 15:29:22.979-08',
                  archived_at: '2017-01-18 15:30:22.979-08'
                },
                {
                  owner: 'AbrahamFergie',
                  repo: 'bloodThirsty.com',
                  number: 43,
                  requested_by: 'AbrahamFergie',
                  claimed_by: 'fabpot',
                  claimed_at: '2017-01-11 16:29:22.979-08',
                  created_at: '2017-01-11 15:29:22.979-08',
                  updated_at: '2017-01-11 15:29:22.979-08',
                  completed_at: '2017-01-11 17:28:22.979-08'
                }
              ]
            )
          })
          //player logs in
          .then(_ => player.loginAs(15825329))
          //player goes to homepage
          .then(_ => player.visit('/'))
          //player should see their name
          .then(_ => player.shouldSee('Abraham Ferguson'))
          //coach logs in
          .then(_ => coach.loginAs(47313))
          //coach goes to homepage
          .then(_ => coach.visit('/'))
          //coach should see their name
          .then(_ => coach.shouldSee('Fabien Potencier'))
          // player archives a Prrr
          // .then(_ => player.clickOn('PrrrsTable MyRequestedPrrrs'))
          .then(_ => player.archiveMyRequestedPrrr('AbrahamFergie/Archive.com/pull/46', By.css('table.MyRequestedPrrrs')))
          .then(_ => player.switchTo().alert().getText())
          .then(text => {
            expect(text).to.include('Are you sure you want to archive your')
            expect(text).to.include('Pull Request Review Request for')
            expect(text).to.include('https://github.com/AbrahamFergie/Archive.com/pull/46')
          })
          .then(_ => player.switchTo().alert().accept())
          //coach sees only only Prrr ready for review
          .then(_ => coach.shouldSee('Pending Prrrs: 1'))
          //player clicks add Prrr button, then redirects to addPrrr page
          .then(_ => player.clickOn('Add a Prrr'))
          //player pastes pull request url into text box
          .then(_ => {
            player.findElement(By.className('RequestReviewPage-InputBox'))
              .sendKeys('https://github.com/AbrahamFergie/Obeisant-Gecko/pull/6')
          })
          // player creates the new Prrr
          .then(_ => player.clickOn('Add Prrr'))
          // player sees new per in "My Requested Prrrs" table
          .then(_ => player.shouldSee('Pending Prrrs: 1'))
          .then(_ => player.shouldSeeWithin('AbrahamFergie/Obeisant-Gecko/pull/6', By.css('table.MyRequestedPrrrs')))
          .then(_ => player.shouldSeeWithin('AbrahamFergie/bloodThirsty.com/pull/41', By.css('table.MyRequestedPrrrs')))
          .then(_ => player.shouldSeeWithin('AbrahamFergie/bloodThirsty.com/pull/43', By.css('table.MyRequestedPrrrs')))
          .then(_ => player.shouldNotSeeWithin('AbrahamFergie/Archive.com/pull/46', By.css('table.MyRequestedPrrrs')))
          // .then(_ => player.shouldNotSeeWithin('AbrahamFergie/bloodThirsty.com/pull/43', By.css('table.MyRequestedPrrrs')))
          .then(_ => coach.shouldSee('Pending Prrrs: 2'))
          //player notices that current pull request is under my requested prrrs with pull request address and request by information and opens links
          //coach claims a pull request
          .then(_ => coach.clickOn('Review a PR'))
          //finds tabs as they open
          .then(_ => coach.shouldSeePopupAt('https://github.com/AbrahamFergie/hibbityDibbity.com/pull/42'))

          .then(_ => player.sleep(5000))


          // .then(_ => coach.wait(coach.identifyTabPopup(), 2000))
          // //closes said tabs
          // .then(_ => coach.wait(coach.closeTabs(), 2000))
          // //coach then decides to unclaim Prrr and should see 2 pending Prrrs again
          // .then(_ => coach.clickOn('Unclaim'))
          // .then(_ => coach.getTheText('Pending Prrrs: 2'))
          // .then(text => expect(text).to.eql('Pending Prrrs: 2'))
          // //coach decides to claim Prrr again
          // .then(_ => coach.clickOn('Review a PR'))
          // //finds tabs as they open
          // .then(_ => coach.wait(coach.identifyTabPopup(), 2000))
          // //closes said tabs
          // .then(_ => coach.wait(coach.closeTabs(), 2000))
          // //coach completes Prrr review upon a substantial inquiry into the pull request adding comments and smiley faces in appropriate places
          // .then(_ => coach.clickOn('Complete'))
          // //player sees that prrr has been completed
          // .then(_ => player.findByXPATH('a few seconds ago'))
          // // //coach toggles My Reviewed table
          // .then(_ => coach.findByXPATH('a few seconds ago'))
          // .then(_ => coach.clickOn('My Reviewed Prrrs'))
          // //coach toggles My Reviewed table again
          // .then(_ => coach.clickOn('My Reviewed Prrrs'))
          // //player goes to the metrics page
          // .then(_ => player.visit('/metrics/2017-01-18'))
          // //player then verifies that all the data on the page is correct
          // .then(_ => player.getTheText('Total code reviews: '))
          // .then(data => expect(parseInt(data)).to.be.a('number'))
          // .then(_ => player.getTheText('Average time for PR to be claimed: '))
          // .then(data => expect(data).to.be.a('string'))
          // .then(_ => player.getTheText('Average time for PR to be completed: '))
          // .then(data => expect(data).to.be.a('string'))
          // .then(_ => player.getTheText('Total number of projects that requested reviews: '))
          // .then(data => expect(parseInt(data)).to.be.a('number'))
          // .then(_ => player.getTheText('Average number of reviews requested per project: '))
          // .then(data => expect(parseInt(data)).to.be.a('number'))
          // .then(_ => player.getTheText('MetricsPage-reviewers-total'))
          // .then(data => expect(parseInt(data)).to.be.a('number'))
          // .then(_ => player.getTheText('MetricsPage-reviewers-reviewer'))
          // .then(data => expect(data).to.be.a('string'))
          // //player verifies that week is week of January 16, 2017
          // .then(_ => player.getTheText('MetricsPage-header'))
          // .then(data => expect(data).to.eql('Metrics For: 2017-01-16'))
          // //player navigates to previous week
          // .then(_ => player.clickOn('last week'))
          // //player expects previous week to be January 9, 2017
          // .then(_ => player.getTheText('MetricsPage-header'))
          // .then(data => expect(data).to.eql('Metrics For: 2017-01-09'))
          // //player navigates to next week
          // .then(_ => player.clickOn('next week'))
          // //player expects next week is week of January 16, 2017
          // .then(_ => player.getTheText('MetricsPage-header'))
          // .then(data => expect(data).to.eql('Metrics For: 2017-01-16'))
          // .then(_ => this.waitForAllBrowsers())
          // .then(_ => player.sleep(2000) )
      })
    })
  })
})
