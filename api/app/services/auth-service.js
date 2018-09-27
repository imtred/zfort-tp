const DaoFactory = require('../dao');
const authMapper = require('../mappers/auth-mapper');
const passport = require('../config/strategies');
const bcrypt = require('bcryptjs');
const DatabaseError = require('../errors/database-error');

/**
 * Auth service
 * @class AuthService
 */
class AuthService {
    constructor() {
        this._userDao = DaoFactory.loadDao('user-dao');
        this._userDescriptionsDao = DaoFactory.loadDao('user-descriptions-dao');
        this._tokenDao = DaoFactory.loadDao('token-dao');
        this._userCredentialsDao = DaoFactory.loadDao('user-credentials-dao');
    }

    /**
     * User exist validation
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    validationUserExist(params) {
        return this._userDao
            .getUser(authMapper.registerValidationUserExistToRequest(params))
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Save user access token
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    saveToken(params) {
        return this._tokenDao
            .createUserToken(authMapper.loginSaveTokenToRequest(params))
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Update user access token
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    updateToken(params) {
        return this._tokenDao
            .updateUserToken(
                authMapper.setLoginUpdateTokenFields(params.userId),
                authMapper.setLoginUpdateToken(params.token)
            )
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Update user access token
     * @param {Number} userId
     * @return {Promise.<Object>}
     */
    findToken(userId) {
        return this._tokenDao
            .getUserToken(authMapper.loginFindTokenToRequest(userId))
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Delete user access token
     * @param {String} token
     * @return {Promise.<Object>}
     */
    deleteToken(token) {
        return this._tokenDao.deleteUserToken(authMapper.deleteTokenToRequest(token)).catch(err => {
            throw new DatabaseError(err);
        });
    }

    /**
     * Register company
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    signup(params) {
        let userData = null;
        return this._userDao
            .createUser(authMapper.registerUserToRequest('user', params, null))
            .then(user => {
                userData = user;
                const password = params.password;
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                return this._userCredentialsDao.createCredential(
                    authMapper.registerUserToRequest('userCred', { hash, salt }, userData.id)
                );
            })
            .then(() => {
                return this._userDescriptionsDao.createUserDescription(
                    authMapper.registerUserToRequest('userDesc', params, userData.id)
                );
            })
            .then(() => {
                passport.authenticate('local', (err, user, info) => {
                    if (user) {
                        return user;
                    }
                });
            })
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Login company
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    login(params) {
        let loginRes = {};

        return this._userDescriptionsDao
            .getUserDescription(authMapper.loginToRequest(params))
            .then(userDesc => {
                loginRes.user = {
                    firstName: userDesc.firstName,
                    lastName: userDesc.lastName,
                    email: userDesc.email
                };
                return loginRes;
            })
            .catch(err => {
                throw new DatabaseError(err);
            });
    }
}

module.exports = new AuthService();
