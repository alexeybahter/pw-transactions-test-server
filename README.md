Server boilerplate

Installation:

In `config` folder create `config.json` file with next structure:

```
{
  "development": {
    "db": {
      "username": "name",
      "password": "pass",
      "database": "db_name",
      "host": "127.0.0.1",
      "dialect": "postgres",
      "logging": false
    },
    "common": {
      "jwtSecret": "secret",
      "accessTokenExpiresInSec": 172800,
      "refreshTokenExpiresInSec": 604800,
      "accessTokenExpiresIn": "2days",
      "refreshTokenExpiresIn": "7days",
      "url": "http://localhost:6800",
      "siteAddress": "http://localhost:3000",
      "hashType": "md5",
      "hashKey": "hashkey"
    },
  },
}
```

Create a database with name what you mentioned in `config.json`

run
`npm install`

`npm run migrate`

run `npm test` to be sure that everything is ok

And run server

`npm start`

On `http://localhost:6800/api-docs/` you can try swagger

| Config                        | description                                             |
| ----------------------------- | ------------------------------------------------------- |
| `db`                          | db config                                               |
| username                      | username                                                |
| password                      | password for db                                          |
| database                      | name of database                                        |
| host                          | url to db                                               |
| dialect                       | type of db                                              |
| logging                       | should logs br written to console                       |
| common                        |                                                         |
| jwtSecret                     | jwt secret key                                          |
| accessTokenExpiresInSec       | token expiration time (in seconds)                      |
| refreshTokenExpiresInSec      | refresh expiration time (in seconds)                    |
| accessTokenExpiresIn          | token expiration time (in days)                         |
| refreshTokenExpiresIn         | refresh expiration time (in days)                       |
| url                           | server url                                              |
| siteAddress                   | frontside url                                           |
| hashType                      | hashing password algorithm                              |
| hashKey                       | hash key                                                |