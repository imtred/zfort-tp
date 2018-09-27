const chai = require('chai');
const chaiHttp = require('chai-http');
const testAuthHelper = require('./include/test-auth-helper');
const config = require('../api/app/config');

chai.use(chaiHttp);

const should = chai.should();
const request = chai.request(`${config.host}:${config.port}`);

/**
 * USERS test
 */

describe('Check user profile', () => {
    let accessToken = null;
    let firstName = null;
    let lastName = null;
    let email = null;
    let password = null;
    before(done => {
        firstName = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '');
        lastName = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '');
        email =
            Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, '') + '@gmail.com';
        password = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '');
        console.log('--------------------------|');
        console.log({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });
        console.log('--------------------------|');
        testAuthHelper.signupUser(
            {
                firstName,
                lastName,
                email,
                password
            },
            (err, result) => {
                if (err) done(err);

                testAuthHelper.getAccessToken(
                    {
                        email,
                        password
                    },
                    (err, result) => {
                        if (err) done(err);

                        console.log(result);
                        console.log('--------------------------|');
                        accessToken = result.access_token;

                        done();
                    }
                );
            }
        );
    });

    /**
     * Get user profile
     */
    describe('GET /api/v1/user/profile', () => {
        it('it should get user profile', done => {
            request
                .get('/api/v1/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should\'t get all countries because of authorization failed', done => {
            request
                .get('/api/v1/user/profile')
                .set('Authorization', 'Bearer ')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});
