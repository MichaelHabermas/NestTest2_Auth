<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Nest test API

Test an Api built in Nest.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Commands

```bash
# Terminal 1
# make sure Docker desktop is running
# start database
$ docker-compose up
# Terminal 2
# start Nest BE
$ npm run start:dev
# Terminal 3


# if schema changes:
$ prisma migrate dev
# if db is cleared, or table shape is changed:
$ npx prisma db seed


# Unsorted
# When doing the below, db must be UP, and BE must be DOWN
$ npx prisma generate
```

## End Points

```bash
# Swagger
/api

# Login
/login

# Sign Up
/signUp
```

## License

Nest is [MIT licensed](LICENSE).
