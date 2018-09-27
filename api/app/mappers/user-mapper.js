const _ = require('lodash');

/**
 * User mapper
 * @class UserMapper
 */
class UserMapper {
    /**
     * Requests
     */
    getUserProfileToRequest(params) {
        return {
            userId: params.id,
            roleId: params.roleId
        };
    }

    /**
     * Responses
     */
    getUserProfileToResponse(userProfile) {
        return {
            firstName: _.get(userProfile.userDesc, 'firstName', null) || null,
            lastName: _.get(userProfile.userDesc, 'lastName', null) || null,
            email: _.get(userProfile.userDesc, 'email', null) || null
        };
    }
}

module.exports = new UserMapper();
