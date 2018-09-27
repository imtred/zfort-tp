const passport = require('passport');
const DaoFactory = require('../dao');
const userDao = DaoFactory.loadDao('user-dao');
const config = require('../config');
const tokenDao = DaoFactory.loadDao('token-dao');
const userCredentialsDao = DaoFactory.loadDao('user-credentials-dao');
const authHelpers = require('../utils/auth-helpers');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

const init = require('./passport');

const options = {
    usernameField: 'email',
    passwordField: 'password'
};

init();

passport.use(
    new LocalStrategy(options, (username, password, done) => {
        let userData = null;
        userDao
            .getUser({
                username
            })
            .then(user => {
                if (!user) return done(null, 'userNotFound');
                userData = user;
                return userCredentialsDao.getCredential({
                    userId: user.id
                });
            })
            .then(credentials => {
                if (!authHelpers.comparePass(password, credentials.password)) {
                    return done(null, 'wrongPassword');
                }
                return done(null, userData);
            })
            .catch(err => {
                return done(err);
            });
    })
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtSecretKey
        },
        (jwtPayload, cb) => {
            return tokenDao
                .getUserToken({ userId: jwtPayload.id })
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    )
);

module.exports = passport;
