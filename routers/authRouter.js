const Router = require('express')
const authRouter = new Router()
const AuthController = require('../controllers/authController')
const {check} = require('express-validator')
const authMiddleware = require('./../middleware/authMiddleware')
const roleMiddleware = require('./../middleware/roleMiddleware')

authRouter.post('/login', AuthController.login)
authRouter.post('/loginByPhone', AuthController.loginByPhoneNumber)
authRouter.post('/registration', [
    check('name', 'Имя не должен быть пустым').notEmpty(),
    check('surname', 'Фамилия не должен быть пустым').notEmpty(),
    check('mail', 'Почта не должен быть пустым').notEmpty(),
    check('phoneNumber', 'Номер не должен быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 3 и меньше 20').isLength({min: 3, max: 20}),
], AuthController.registration)
authRouter.get('/users', AuthController.getUsers)
authRouter.post('/forgotPassword', AuthController.forgotPassword)
authRouter.post('/forgotPasswordByPhone', AuthController.forgotPasswordByPhone)
authRouter.post('/resetPassword', AuthController.resetPassword)
// authRouter.get('/users', roleMiddleware(['USER']), AuthController.getUsers)

module.exports = authRouter