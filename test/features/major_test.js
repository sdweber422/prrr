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
                  created_at: '2017-01-18 16:29:22.979-08',
                  updated_at: '2017-01-18 16:29:22.979-08'
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
            player.insertPullRequestAddress('https://github.com/AbrahamFergie/Obeisant-Gecko/pull/6', By.css('input.RequestReviewPage-InputBox'))
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
          .then(_ => player.shouldSeeWithin('There are currently no Pending Pull Request Review Requests from other Learners at this time. Check back later.', By.css('div.ClaimAPrrr-UserNeedsToClaimAPrrr-Unavailable')))
          .then(_ => coach.identifyTabPopup())
          //closes said tabs
          .then(_ => coach.closeTabs())
          .then(_ => coach.clickOn('Complete'))
          //coach claims another pull request
          .then(_ => coach.clickOn('Review a PR'))
          //finds tabs as they open
          .then(_ => coach.shouldSeePopupAt('https://github.com/AbrahamFergie/Obeisant-Gecko/pull/6'))
          .then(_ => coach.identifyTabPopup())
          //closes said tabs
          .then(_ => coach.closeTabs())
          //coach then decides to abandon Prrr and should see 1 pending Prrrs again
          .then(_ => coach.clickOn('Abandon'))
          .then(_ => coach.shouldSee('Pending Prrrs: 1'))
          //coach decides to claim Prrr again
          .then(_ => coach.clickOn('Review a PR'))
          .then(_ => coach.shouldSeePopupAt('https://github.com/AbrahamFergie/Obeisant-Gecko/pull/6'))
          //finds tabs as they open
          .then(_ => coach.identifyTabPopup())
          //closes said tabs
          .then(_ => coach.closeTabs())
          //coach should see the timer and other elements relating to the claimed pull request
          .then(_ => coach.shouldSeeWithin('00:59:59', By.css('div.Timer')))
          .then(_ => coach.shouldSeeWithin('Reviewing:', By.css('div.ClaimAPrrr-UserClaimedAPrrr')))
          // .then(_ => coach.shouldSeeWithin('https://github.com/AbrahamFergie/Obeisant-Gecko/pull/6', By.css('div.ClaimAPrrr-UserClaimedAPrrr//a')))
          // For: AbrahamFergie Requested: a few seconds ago https://github.com/AbrahamFergie/Obeisant-Gecko/pull/6
          .then(_ => player.sleep(4040404))
          //coach completes Prrr review upon a substantial inquiry into the pull request adding comments and smiley faces in appropriate places
          .then(_ => coach.clickOn('Complete'))
          .then(_ => coach.shouldSee('There are currently no Pending Pull Request Review Requests from other Learners at this time. Check back later.'))
          .then(_ => coach.shouldSeeWithin('AbrahamFergie/Obeisant-Gecko/pull/6', By.css('table.MyReviewedPrrrs')))
          .then(_ => coach.shouldSeeWithin('AbrahamFergie/hibbityDibbity.com/pull/42', By.css('table.MyReviewedPrrrs')))
          .then(_ => coach.shouldSeeWithin('AbrahamFergie/bloodThirsty.com/pull/43', By.css('table.MyReviewedPrrrs')))
          .then(_ => coach.shouldSeeWithin('by AbrahamFergie a few seconds ago', By.css('table.MyReviewedPrrrs')))
          .then(_ => coach.shouldSeeWithin('by countChocula', By.css('table.MyReviewedPrrrs')))
          .then(_ => coach.shouldSeeWithin('by AbrahamFergie', By.css('table.MyReviewedPrrrs')))
          .then(_ => player.shouldSeeWithin('a few seconds ago', By.css('table.MyRequestedPrrrs')))
          //player sees that prrr has been completed
          // //coach toggles My Reviewed table
          // .then(_ => coach.shouldSeeWithin('a few seconds ago'))
          // .then(_ => coach.clickOn('My Reviewed Prrrs'))
          //coach toggles My Reviewed table again
          // .then(_ => coach.clickOn('My Reviewed Prrrs'))
          .then(_ => player.sleep(500000))
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
