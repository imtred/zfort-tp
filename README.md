# ZFort-Test-Project

## Local deployment

### Install Node.js ###
```sh
$ sudo apt-get update
$ curl -sL https://deb.nodesource.com/setup_8.11.2 | sudo -E bash -
$ sudo apt-get install -y nodejs
$ sudo apt-get install -y build-essential
$ npm install
```

### Install PostgreSQL and PgAdmin3 ###
```sh
$ sudo apt-get update
$ sudo apt-get install postgresql postgresql-contrib
$ sudo apt-get install pgadmin3
```

### Configure PostgreSQL ###
```sh
$ sudo -u postgres psql postgres
postgres=# alter user postgres with password 'postgres';
postgres=# /q
```

### Migrate DB ###
```sh
$ npm run create-db
$ npm run db-migrate-up
```

### Run Node.js DEV ###
```sh
$ npm run dev
```

### Remove DB migration ###
```sh
$ npm run db-migrate-down-all
```

### Run integration tests ###
```sh
$ npm run test
```