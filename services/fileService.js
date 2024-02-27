const File = require("../models/File");

class FileService {

    async getAll (params) {
        const { page, limit, globalFilter } = params
        let regex = ''
        if (globalFilter !== 'null') {
            regex = new RegExp(globalFilter, 'i')
        }
        const files = await File.find({
            name: {$regex: regex},
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const count = await File.count()
        return {
            resp: files,
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            currentPage: page
        }
    }

}

module.exports = new FileService()