import Queries from '../server/queries'
import Commands from '../server/commands'

const commands = new Commands()

const withUsersInTheDatabase = callback => {

  context('When a user exists in the database', () => {
    beforeEach( () => {
      return commands.createUser({
        name: 'Graham Campbell',
        email: 'graham@alt-three.com',
        avatar_url: 'https://avatars1.githubusercontent.com/u/2829600?v=3&s=460',
        github_id: 123456,
        github_username: 'Graham Campbell',
        github_access_token: 'FAKE_GITHUB_ACCESS_TOKEN',
        github_refresh_token: null,
      })
    })
    callback()
  })
}

export { withUsersInTheDatabase }
