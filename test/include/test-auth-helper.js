const request = require('request');

class TestAuthHelper {
    signupUser(params, callback) {
        request(
            {
                method: 'POST',
                uri: 'http://localhost:4000/api/v1/auth/signup',
                options: {
                    contentType: 'application/json'
                },
                form: {
                    firstName: params.firstName,
                    lastName: params.lastName,
                    email: params.email,
                    password: params.password
                }
            },
            (err, res, body) => {
                if (err) callback(err);
                callback(null, body.status);
            }
        );
    }

    getAccessToken(params, callback) {
        request(
            {
                method: 'POST',
                uri: 'http://localhost:4000/api/v1/auth/login',
                options: {
                    contentType: 'application/json'
                },
                form: {
                    email: params.email,
                    password: params.password
                }
            },
            (err, res, body) => {
                if (err) callback(err);
                let userData = JSON.parse(body);
                callback(null, userData.token);
            }
        );
    }
}

module.exports = new TestAuthHelper();
