const DaoFactory = require('../dao');
const DatabaseError = require('../errors/database-error');
const userMapper = require('../mappers/user-mapper');

/**
 * User service
 * @class UserService
 */
class UserService {
    constructor() {
        this._userDao = DaoFactory.loadDao('user-dao');
        this._userDescriptionsDao = DaoFactory.loadDao('user-descriptions-dao');
    }

    /**
     * Get user profile info
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getUserProfile(params) {
        let userProfile = {};
        return this._userDescriptionsDao
            .getUserDescription({
                userId: params.userId
            })
            .then(userDesc => {
                userProfile.userDesc = userDesc;
                return userMapper.getUserProfileToResponse(userProfile);
            })
            .catch(err => {
                throw new DatabaseError(err);
            });
    }
}

module.exports = new UserService();
