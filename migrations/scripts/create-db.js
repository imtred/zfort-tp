const { Client } = require('pg');

const config = require('../../api/app/config');

const dbUser = config.database.user,
    dbPassword = config.database.password,
    dbHost = config.database.host,
    dbPort = config.database.port,
    dbName = config.database.name;

console.log(
    'postgres://zraqikgafddnza:e335ac633fa965a65144d245721f83b6d957efa45ea02d18c3c5c7eb8bb8421a@ec2-54-227-240-7.compute-1.amazonaws.com:5432/db8mu5uuoaf65i'
);

const CONNECTION_STRING =
    'postgres://zraqikgafddnza:e335ac633fa965a65144d245721f83b6d957efa45ea02d18c3c5c7eb8bb8421a@ec2-54-227-240-7.compute-1.amazonaws.com:5432/db8mu5uuoaf65i';
const client = new Client(CONNECTION_STRING);

client.connect();
client.query(`CREATE DATABASE ${dbName}`, () => {
    client.end();
});
