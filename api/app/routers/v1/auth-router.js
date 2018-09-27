const express = require('express');
const authService = require('../../services/auth-service');
const authMapper = require('../../mappers/auth-mapper');
const ValidationError = require('../../errors/validation-error');
const ServerError = require('../../errors/server-error');
const DatabaseError = require('../../errors/database-error');
const config = require('../../config');
const passport = require('../../config/strategies');
const router = express.Router();

const jwt = require('jsonwebtoken');

/**
 * Auth signup
 * @api /api/auth/signup
 * @method post
 * @return 200 Registration success
 * @return 500 Registration failed
 * @return 422 Validation failed
 */
router.post('/auth/signup', (req, res, next) => {
    req.checkBody('firstName', 'Firstname can not be empty').notEmpty();
    req.checkBody('lastName', 'Lastname can not be empty').notEmpty();
    req.checkBody('email', 'Email can not be empty').notEmpty();
    req.checkBody('email', 'Enter the valid email.').isEmail();
    req.checkBody('password', 'Password can not be empty').notEmpty();
    let errors = req.validationErrors();

    if (errors) {
        return next(new ValidationError(errors));
    }

    let params = req.body;
    params.roleId = 2;

    authService
        .validationUserExist(params)
        .then(user => {
            if (user)
                throw new ServerError(
                    'User with this email already exist.',
                    422,
                    'Registration error',
                    'register user',
                    'email'
                );

            return authService.signup(params);
        })
        .then(() => {
            res.status(200).json(authMapper.signupToResponse());
        })
        .catch(err => {
            return next(err);
        });
});

/**
 * Auth login
 * @api /api/auth/login
 * @method post
 * @return 200 Login success
 * @return 500 Login failed
 * @return 422 Validation failed
 */
router.post('/auth/login', (req, res, next) => {
    req.checkBody('email', 'Email can not be empty').notEmpty();
    req.checkBody('email', 'Enter the valid email.').isEmail();
    req.checkBody('password', 'Password can not be empty').notEmpty();
    let errors = req.validationErrors();

    if (errors) {
        return next(new ValidationError(errors));
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(new DatabaseError(err));
        }
        if (user === 'userNotFound') {
            return next(
                new ServerError('User not found.', 422, 'Login error', 'user login', 'email')
            );
        }
        if (user === 'wrongPassword') {
            return next(
                new ServerError('Wrong password.', 422, 'Login error', 'user login', 'password')
            );
        }
        req.logIn(user, err => {
            let loginResData = null;
            let genToken = null;
            let params = {};
            if (err) {
                return next(new DatabaseError(err));
            }
            authService
                .login(user)
                .then(loginRes => {
                    loginResData = loginRes;
                    const token = jwt.sign(user.toJSON(), config.jwtSecretKey);
                    return token;
                })
                .then(token => {
                    genToken = token;
                    return authService.findToken(user.id);
                })
                .then(tokenDesc => {
                    if (!tokenDesc) {
                        params.userId = user.id;
                        params.token = genToken;
                        return authService.saveToken(params);
                    } else {
                        params.userId = user.id;
                        params.token = tokenDesc.token;
                        return authService.updateToken(params);
                    }
                })
                .then(userToken => {
                    loginResData.token = {
                        access_token: userToken.token
                    };
                    return res.status(200).json(authMapper.loginToResponse(loginResData));
                })
                .catch(err => {
                    return next(new DatabaseError(err));
                });
        });
    })(req, res, next);
});

/**
 * Auth logout
 * @api /api/auth/logout
 * @method post
 * @return 200 Logout success
 * @return 500 Logout failed
 */
router.post('/auth/logout', (req, res, next) => {
    return authService
        .deleteToken(authMapper.logoutToRequest(req))
        .then(() => {
            req.logout();
            res.status(200).json({ status: true });
        })
        .catch(err => {
            return next(new DatabaseError(err));
        });
});

/**
 * Check authorization
 * @method post
 * @return 200 Authorization success
 * @return 500 Authorization 2-d step failed
 * @return 422 Validation failed
 * @return 401 Authorization 1-st step failed
 */
router.use('', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err)
            return next(
                new ServerError(
                    'User token unauthorized',
                    401,
                    'Authorization error',
                    'authorize token',
                    'token'
                )
            );
        if (!user)
            return next(
                new ServerError(
                    'User token unauthorized',
                    401,
                    'Authorization error',
                    'authorize token',
                    'token'
                )
            );
        next();
    })(req, res, next);
});

module.exports = router;
