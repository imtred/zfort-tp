module.exports = {
    env: process.env.NODE_ENV || 'development',
    root: `${__dirname}/../../../`,
    host: process.env.HOST || 'http://localhost',
    port: process.env.PORT || 4000,
    secretKey: process.env.SECRET || 'mY.pRoJ#sEcReT',
    jwtSecretKey: process.env.JWT_SECRET || 'mY.pRoJ#sEcReT#jWt',

    database: {
        name: process.env.DB_NAME || 'zforttp',
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: process.env.DB_LOGGING || true,
        port: process.env.DB_PORT || 5432
    },

    cors: {
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
    },

    urlHost: process.env.URL_HOST || 'localhost:4000'
};
