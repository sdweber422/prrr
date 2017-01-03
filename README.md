# Pull Request Review Request

## Prrr

![prrr](http://www.kittenswhiskers.com/wp-content/uploads/sites/48/2014/05/cat-purring.jpg)


## Development


### Setup

Go [here](https://github.com/settings/developers) and register a new OAuth
application.

```
Application name: prrr development
Homepage URL: http://localhost:3000/
Application Description:
Authorization callback URL: http://localhost:3000/auth/github/callback
```

*NOTE: you can use any port you want. It doesnt need to be 3000*


Create a `.env` file like this:

```
NODE_ENV=development
PORT=3000
GITHUB_CLIENT_ID=<FOLLOW GITHUB INSTRUCTIONS>
GITHUB_CLIENT_SECRET=<FOLLOW GITHUB INSTRUCTIONS>
GITHUB_CALLBACK=<FOLLOW GITHUB INSTRUCTIONS>
SESSION_KEY=thiscanbeanyoldrandomstring
```

*NOTE: you can use any port you want as long as it matches your
github oauth*

### Database

```sh
createdb prrr-development
createdb prrr-test
knex migrate:latest
```
