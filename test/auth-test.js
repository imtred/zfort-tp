const chai = require('chai');
const chaiHttp = require('chai-http');
//const testAuthHelper = require('./include/test-auth-helper');
const config = require('../api/app/config');

chai.use(chaiHttp);

const should = chai.should();
const request = chai.request(`${config.host}:${config.port}`);

/**
 * AUTH test
 */
let refreshToken;

describe('Check auth system', () => {
    // "firstName": "Jac31k",
    //     "lastName": "Da32n",
    //     "email": "j23d@gmail.com",
    //     "password": "12345678"
    let firstName = null;
    let lastName = null;
    let email = null;
    let password = null;
    // before(done => {
    //     testAuthHelper.getRefreshToken((err, result) => {
    //         if (err) done(err);
    //
    //         refreshToken = result.refreshToken;
    //         done();
    //     });
    // });
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
        done();
    });

    /**
     * Register user
     */
    describe('POST /api/v1/auth/signup', () => {
        it('it should register the new user', done => {
            request
                .post('/api/v1/auth/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    firstName,
                    lastName,
                    email,
                    password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it shouldn\'t register the new user because of empty email', done => {
            request
                .post('/api/v1/auth/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    firstName,
                    lastName,
                    password
                })
                .end((err, res) => {
                    res.should.have.status(422);
                    done();
                });
        });
    });

    /**
     * Login user
     */
    describe('POST /api/v1/users/login', () => {
        it('it should login user', done => {
            request
                .post('/api/v1/auth/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    email: email,
                    password: password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it shouldn\'t login user because of empty password', done => {
            request
                .post('/api/v1/auth/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    email: email
                })
                .end((err, res) => {
                    res.should.have.status(422);
                    done();
                });
        });
    });
});
