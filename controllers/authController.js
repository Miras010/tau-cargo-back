const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { validationResult } = require('express-validator')
const {secret} = require('../config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class AuthController {
    async registration (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка регистрации', errors})
            }
            const {username, name, surname, mail, phoneNumber, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }
            const candidate2 = await User.findOne({phoneNumber})
            if (candidate2) {
                return res.status(400).json({message: 'Пользователь с таким номером уже существует'})
            }
            const hashedPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({username, name, surname, mail, phoneNumber, password: hashedPassword, roles: [userRole.value]})
            await user.save()
            res.status(200).json({message: 'Пользователь успешно создан!'})
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async login (req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            if (!user.isActive) {
                const roles = user.roles
                let isAdmin = false
                roles.forEach(role => {
                    if(role === 'ADMIN') {
                        isAdmin = true
                    }
                })
                if (!isAdmin) {
                    return res.status(400).json({message: `Пользователь ${username} не активирован`})
                }
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: 'Введен неправильный пароль'})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.status(200).json({token, roles: user.roles, userInfo: user})
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async loginByPhoneNumber (req, res) {
        try {
            const {phoneNumber, password} = req.body
            const user = await User.findOne({phoneNumber})
            if (!user) {
                return res.status(400).json({message: `Пользователь с номером ${phoneNumber} не найден`})
            }
            if (!user.isActive) {
                const roles = user.roles
                let isAdmin = false
                roles.forEach(role => {
                    if(role === 'ADMIN') {
                        isAdmin = true
                    }
                })
                if (!isAdmin) {
                    return res.status(400).json({message: `Пользователь ${phoneNumber} не активирован`})
                }
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: 'Введен неправильный пароль'})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.status(200).json({token, roles: user.roles, userInfo: user})
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async getUsers (req, res) {
        try {
            const users = await User.find()
            res.status(500).json({users})
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async forgotPassword (req, res) {
        try {
            // const title = 'Elmira-cargo'
            // const email = 'elmira-cargo@mail.ru'
            // const emailPassword = 'XhyfPL6fbiP9LXmRYUEF'
            // const url = 'elcargo.kz'

            // const title = 'Zhan-cargo'
            // const email = 'zhan-cargo@mail.ru'
            // const emailPassword = 'iwmWCEyv7pDvGgBJfdwk'
            // const url = 'zhan-cargo.kz'

            // const title = 'Ainar-cargo'
            // const email = 'ainar-cargo@mail.ru'
            // const emailPassword = 'cHfdsXpFwtSwtw4Vhvg2'
            // const url = 'ainar-cargo.kz'

            // const title = 'Dar-cargo'
            // const email = 'dar-cargo@mail.ru'
            // const emailPassword = 'n216JS30fmSNgaPbT0zv'
            // const url = 'dar-logistics.kz'

            // const title = 'Ziya-cargo'
            // const email = 'ziya-cargo@mail.ru'
            // const emailPassword = '9Ea36KCb0e6mhMqPrkDg'
            // const url = 'ziya-cargo.kz'

            // const title = 'G-cargo'
            // const email = 'ggg-cargo@mail.ru'
            // const emailPassword = 'ybp7SM0SmuaqmNLqg55d'
            // const url = 'g-cargo.kz'

            const title = 'Marry-cargo'
            const email = 'marry-cargo@mail.ru'
            const emailPassword = '3d0Yg7bncBi2yW9AEcnS'
            const url = 'marry-cargo.kz'

            const {username} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь не найден`})
            }
            const resetToken = generateAccessToken(user._id, user.roles)
            let transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: email,
                    pass: emailPassword,
                },
            })
            await transporter.sendMail({
                from: `"${title}" <${email}>`,
                to: user.mail,
                subject: 'Attachments',
                text: 'This message with attachments.',
                html: `
                <h1>Добрый день, ${user.name}!</h1>
                <p>Для сброса пароля перейдите по следующей ссылке:</p>
                <p>http://${url}/reset/${resetToken}</p>
                
                <p>Если вы не хотите сбрасывать пароль, то проигнорируйте это сообщение!</p>
                `
            })
            return res.status(200).json()
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async forgotPasswordByPhone (req, res) {
        try {
            const title = 'Cargo'
            const email = 'cargo01kz@mail.ru'
            const emailPassword = 'weeJzWTUNf0xMdJ3pyUA'

            // const url = 'https://aspan-cargo.kz'
            const url = 'https://aru-cargo.kz'
            // const url = 'https://marry-cargo.kz'
            // const url = 'https://aks-cargo.kz'
            // const url = 'https://g-cargo.kz'
            // const url = 'http://ziya-cargo.kz'
            // const url = 'https://dar-logistics.kz'
            // const url = 'https://alan-cargo.kz'
            // const url = 'https://dilya-cargo.kz'
            // const url = 'https://ainar-cargo.kz'
            // const url = 'https://zhan-cargo.kz'
            // const url = 'https://zhappar-cargo.kz'
            // const url = 'https://akty-cargo.kz'
            // const url = 'https://tau-cargo.kz'

            const { phoneNumber } = req.body
            const user = await User.findOne({phoneNumber})
            if (!user) {
                return res.status(400).json({message: `Пользователь не найден`})
            }
            const resetToken = generateAccessToken(user._id, user.roles)
            let transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: email,
                    pass: emailPassword,
                },
            })
            await transporter.sendMail({
                from: `"${title}" <${email}>`,
                to: user.mail,
                subject: 'Attachments',
                text: 'This message with attachments.',
                html: `
                <h1>Добрый день, ${user.name}!</h1>
                <p>Для сброса пароля перейдите по следующей ссылке:</p>
                <p>${url}/reset/${resetToken}</p>
                
                <p>Если вы не хотите сбрасывать пароль, то проигнорируйте это сообщение!</p>
                `
            })
            return res.status(200).json()
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async resetPassword (req, res) {
        try {
            const {token, password} = req.body
            if (!token) {
                return res.status(400).json({message: 'Ссылки не существует'})
            }
            const { id } = jwt.verify(token, secret)
            const hashedPassword = bcrypt.hashSync(password, 7);

            const user = await User.findByIdAndUpdate(id, {password: hashedPassword})
            console.log(id)

            if (!user) {
                return res.status(400).json({message: `Пользователь не найден`})
            }
            return res.status(200).json()
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }


}

module.exports = new AuthController()
