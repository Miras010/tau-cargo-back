const User = require("../models/User");
const Track = require("../models/Track");
const bcrypt = require("bcryptjs");

class UserService {
    async create (data) {
        const createdUser = await User.create(data)
        return createdUser
    }

    async getAll (params) {
        const { page, limit, globalFilter } = params
        let regex = ''
        if (globalFilter !== 'null') {
            regex = new RegExp(globalFilter, 'i')
        }
        const users = await User.find({
            phoneNumber: {$regex: regex},
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const count = await User.count()
        return {
            resp: users,
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            currentPage: page
        }
    }

    async loadUsers (params) {
        const { globalFilter } = params
        let regex = ''
        if (globalFilter !== 'null') {
            regex = new RegExp(globalFilter, 'i')
        }
        const users = await User.find({
            username: {$regex: regex},
        })
            .exec()
        return users
    }

    async update (user) {
        if (!user._id) {
            throw new Error('Enter the id')
        }
        const updatedUser = await User.findByIdAndUpdate(user._id, user, {new: true})
        return updatedUser
    }

    async changePassword({_id, password}) {
        if (!_id) {
            throw new Error('Enter the id')
        }
        const hashedPassword = bcrypt.hashSync(password, 7);
        const updatedUser = await User.findByIdAndUpdate(_id, { password: hashedPassword }, {new: true})
        return updatedUser
    }
}

module.exports = new UserService()