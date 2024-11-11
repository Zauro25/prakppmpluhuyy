import {expect} from 'chai';
import {sinon} from 'sinon';
import {httpStatus} from 'http-status';
import { CreateTask, DeleteTask, GetTasks, UpdateTask, } from '../controllers/auth.controller.js'
import { loginUserWithEmailAndPassword, logout } from '../services/auth.service.js'
import { generateAuthTokens, generateToken, getTokenByRefresh } from '../services/token.service.js'
import { createUser, getUserByEmail} from '../services/user.service.js'
import { createTask } from '../services/task.service.js';

chai.use(require('sinon-chai'))

describe('Auth Controller', () => {
    let req, res, next

    beforeEach(() => {
        req = { body: {}, query: {}, user: {} }
        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis(),
            sendStatus: sinon.stub().returnsThis()
        }
        next = sinon.stub()
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('createTask', () => {
        it('should register a new user and return tokens', async () => {
            const user = { id: 'userId' }
            const tokens = { access: 'accessToken', refresh: 'refreshToken' }


            sinon.stub(generateToken, 'generateAuthTokens').resolves(tokens)

            req.body = { email: 'test@example.com', password: 'password' }

            await CreateTask(req, res, next)

            expect(res.status).to.have.been.calledWith(httpStatus.CREATED)
            expect(res.send).to.have.been.calledWith({ user, tokens })
        })
    })

    describe('loginUserWithEmailAndPassword', () => {
        it('should login user and return tokens', async () => {
            const user = { id: 'userId' }
            const tokens = { access: 'accessToken', refresh: 'refreshToken' }

            sinon.stub(loginUserWithEmailAndPassword, 'loginUserWithEmailAndPassword').resolves(user)
            sinon.stub(generateAuthTokens, 'generateAuthTokens').resolves(tokens)

            req.body = { email: 'test@example.com', password: 'password' }

            await loginUserWithEmailAndPassword(req, res, next)

            expect(res.send).to.have.been.calledWith({ user, tokens })
        })
    })

    describe('logout', () => {
        it('should log out user', async () => {
            sinon.stub(serviceLogout, 'logout').resolves()

            req.body = { refreshToken: 'refreshToken' }

            await logout(req, res, next)

            expect(res.status).to.have.been.calledWith(httpStatus.NO_CONTENT)
            expect(res.send).to.have.been.calledOnce
        })
    })

    describe('refreshTokens', () => {
        it('should refresh tokens', async () => {
            const tokens = { access: 'newAccessToken', refresh: 'newRefreshToken' }

            sinon.stub( getTokenByRefresh, 'refreshAuth').resolves(tokens)

            req.body = { getTokenByRefresh: 'refreshToken' }

            await refreshTokens(req, res, next)

            expect(res.send).to.have.been.calledWith(tokens)
        })
    })

    describe('forgotPassword', () => {
        it('should send reset password email', async () => {
            const resetPasswordToken = 'resetToken'

            sinon.stub(generateToken, 'generateResetPasswordToken').resolves(resetPasswordToken)
            sinon.stub(getUserByEmail, 'sendResetPasswordEmail').resolves()

            req.body = { email: 'test@example.com' }

            await forgotPassword(req, res, next)

            expect(res.status).to.have.been.calledWith(httpStatus.NO_CONTENT)
            expect(res.send).to.have.been.calledOnce
        })
    })

    describe('resetPassword', () => {
        it('should reset password', async () => {
            sinon.stub(loginUserWithEmailAndPassword, 'resetPassword').resolves()

            req.query = { token: 'resetToken' }
            req.body = { password: 'newPassword' }

            await loginUserWithEmailAndPassword(req, res, next)

            expect(res.status).to.have.been.calledWith(httpStatus.NO_CONTENT)
            expect(res.send).to.have.been.calledOnce
        })
    })

    describe('generateVerifyEmailToken', () => {
        it('should send verification email', async () => {
            const verifyEmailToken = 'verifyToken'

            sinon.stub(generateVerifyEmailToken, 'generateVerifyEmailToken').resolves(verifyEmailToken)
            sinon.stub(getUserByEmail, 'sendVerificationEmail').resolves()

            req.user = { email: 'test@example.com' }

            await generateVerifyEmailToken(req, res, next)

            expect(res.status).to.have.been.calledWith(httpStatus.NO_CONTENT)
            expect(res.send).to.have.been.calledOnce
        })
    })

    describe('verifyEmail', () => {
        it('should verify email', async () => {
            sinon.stub(getUserByEmail, 'verifyEmail').resolves()

            req.query = { token: 'verifyToken' }

            await getUserByEmail(req, res, next)

            expect(res.status).to.have.been.calledWith(httpStatus.NO_CONTENT)
            expect(res.send).to.have.been.calledOnce
        })
    })
})
