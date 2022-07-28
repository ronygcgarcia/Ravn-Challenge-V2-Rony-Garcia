# Ravn challenge v2 Rony Garcia

Snack store

## Pre-requisites
- Node v14.17.6
- PostgreSQL 14
- Redis

## Installation
1. Create a copy of `.env.example` with name `.env`
in the root of the project, and set your credentials.

```bash
cp .env.example .env
```

Use the node module manager npm to install dependencies.

```bash
npm install
```
## Commands

Compile the project and run the project with nodemon
```bash
npm run dev
``` 
Compile project:

```bash
npm run build
``` 
Run project: 
```bash
npm run start
``` 
Compile documentation:
```bash
npm run swagger
``` 

## Database commands

```bash
npm run migrate:dev
``` 
1. Replays the existing migration history in the shadow database in order to detect schema drift (edited or deleted migration file, or a manual changes to the database schema)
2. Applies pending migrations to the shadow database (for example, new migrations created by colleagues)
3. Generates a new migration from any changes you made to the Prisma schema before running migrate dev
4. Applies all unapplied migrations to the development database and updates the _prisma_migrations table
5. Triggers the generation of artifacts (for example, the Prisma Client)
The migrate dev command will prompt you to reset the database in the following scenarios:
- Migration history conflicts caused by modified or missing migrations
- The database schema has drifted away from the end-state of the migration history

```bash
npm run migrate:deploy
``` 
1. Compares applied migrations against the migration history and warns if any migrations have been modified.
2. Applies pending migrations.

```bash
npm run migrate:reset
``` 
1. Drops the database/schema if possible, or performs a soft reset if the environment does not allow deleting databases/schemas
2. Creates a new database/schema with the same name if the database/schema was dropped
3. Applies all migrations
4. Runs seed scripts

To seed the database, run the db seed CLI command
```bash
npm run seed
``` 

### Enviroment variables
| Variables| Descripción|  
| ----------- | -----------|
|SYSTEM_NAME                             |The system name tha will display in emails
|HOST 	                                 |Host used to run the application.
|PORT                                    |Port used to run the application.
|APP_ENV                                 |App enviroment.
|SECRET_KEY                              |Secret key to issue token.
|APP_DEBUG                               |Flag to activate stack when an error occurs.
|JWT_EXPIRATION_TIME                     |Expiration time of JWT. 
|REFRESH_EXPIRATION_TYPE                 |Measure unit of expiration time of refresh token.
|REFRESH_EXPIRATION_TIME                 |Time of expiration time of refresh token.
|MAIL_HOST                               |Host email service. 
|MAIL_PORT                               |Port email service.
|MAIL_USER                               |User of email service.
|MAIL_PASS                               |Password of email service.
|MAIL_MESSAGE_HOST                       |Host used to generate emails.
|MAX_PIC_PRODUCTS                        |Max quantity picture allow to upload per product.
|USER_VERIFIED                           |Flag to verify users automatically.

## Testing
To run tests locally you should run the following commands, note: this commands will reset and seed your development.

```bash
npm run test
``` 
```bash
npm run test:coverage
``` 
```bash
npm run test:e2e
``` 

## System limit
The system will manage product stock only, it won´t manage dynamic limits for different sellers. 

Delivery of product is out of the system scope.
