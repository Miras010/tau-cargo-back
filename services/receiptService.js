const Track = require("../models/Track");
const Receipt = require("../models/Receipt");

class ReceiptService {
    async create (data) {
        const created = await Receipt.create(data)
        return created
    }

    async getAll (params) {
        const { page, limit } = params
        const res = await Receipt.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('receiver')
            .exec()
        const count = await Receipt.count()
        return {
            resp: res,
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            currentPage: page
        }
    }

    async getAllByPartner (params) {
        const { page, limit, createdBy } = params
        const tracks = await Receipt.find({
            createdBy: createdBy
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('receiver')
            .exec()
        const count = await Receipt.count()
        return {
            resp: tracks,
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            currentPage: page
        }
    }

    async getUserReceipts (userId) {
        const res = await Receipt.find({
            receiver: userId
        })
        return res
    }


    async update (receipt) {
        if (!receipt._id) {
            throw new Error('Enter the id')
        }
        const updated = await Receipt.findByIdAndUpdate(receipt._id, receipt, {new: true})
        return updated
    }
}

module.exports = new ReceiptService()