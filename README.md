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
# make sure Docker desktop is running

# start database as a daemon
$ npm run db:dev:restart
# start Nest BE
$ npm run start


# if schema changes:
$ prisma migrate dev
# if db is cleared, or table shape is changed:
$ npx prisma db seed


# Unsorted
# When doing the below, db must be UP, and BE must be DOWN
$ npx prisma generate
```

## Basic End Points

For the rest, run and check Swagger UI @localhost:3333/api

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
