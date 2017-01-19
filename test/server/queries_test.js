import knex from '../../server/knex'

describe('Queries', function(){

  describe('getPrrrs', function(){
    it('should resolve with all Prrrs', function(){
      const queries = new Queries
      return queries.getPrrrs()
        .then(prrrs => {
          expect(prrrs).to.be.an('array')
        })
    })
  })


  context('as Nico', function(){
    let commands
    beforeEach(function(){
      return (new Commands()).createUser({
        name: 'Nico',
        email: 'nicosm310@gmail.com',
        avatar_url: 'https://avatars0.githubusercontent.com/u/18688343?v=3&s=460',
        github_id: 987654,
        github_username: 'nicosesma',
        github_access_token: 'FAKE_GITHUB_ACCESS_TOKEN',
        github_refresh_token: null,
      })
      .then(nico => {
        commands = new Commands(nico)
      })
    })

    describe('getNextPendingPrrr', function(){
      it('should return the oldest unclaimed Prrr not requested by user', function(){
        const queries = new Queries
        const insertPrrr = attributes =>
          knex
            .insert(attributes)
            .into('pull_request_review_requests')

        return Promise.all([
          insertPrrr({
            id: 33,
            owner: 'anasauce',
            repo: 'prrr-so-meta',
            number: 45,
            requested_by: 'anasauce',
            claimed_by:  null,
            claimed_at:  null,
            created_at: '2017-01-09 09:52:08.244-08',
            updated_at: '2017-01-03 17:38:54.803-08',
          }),
          insertPrrr({
            id: 34,
            owner: 'ykatz',
            repo: 'prrr-be-awesome',
            number: 45,
            requested_by: 'nicosesma',
            claimed_by: null,
            claimed_at: null,
            created_at: '2017-01-09 08:52:08.244-08',
            updated_at: '2017-01-03 17:38:54.803-08',
          }),
        ])
        .then(_ => commands.queries.getNextPendingPrrr())
        .then( prrr => {
          expect(prrr).to.be.an('object')
          expect(prrr.id).to.be.a('number')
          expect(prrr.owner).to.eql('anasauce')
          expect(prrr.repo).to.eql('prrr-so-meta')
          expect(prrr.number).to.eql(45)
          expect(prrr.requested_by).to.eql('anasauce')
          expect(prrr.claimed_at).to.eql(null)
          expect(prrr.created_at).to.be.a('date')
          expect(prrr.updated_at).to.be.a('date')
          expect(prrr.archived_at).to.eql(null)
        })
      })
      it('should return null if there are no pending Prrrs', function(){
        const queries = new Queries
        return commands.queries.getNextPendingPrrr()
        .then(prrr => {
          expect(prrr).to.be.undefined
        })
      })
    })
  })
})
