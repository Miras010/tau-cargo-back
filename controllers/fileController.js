const File = require('../models/File')
const FileService = require("../services/fileService");

class FileController {

    async getAll (req, res) {
        try {
            const { page = 1, limit = 10, globalFilter = ''} = req.query
            const posts = await FileService.getAll({page, limit, globalFilter})
            res.status(200).json(posts)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async uploadFile (req, res) {
        try {
            const file = req.files.file
            const { name, date, statusKey, statusValue } = req.body
            let path = `newFiles/${name}`
            await file.mv(path)
            const type = file.name.split('.').pop()
            const created = await File.create({
                name: req.body.name,
                date,
                statusKey,
                statusValue,
                type,
                size: file.size
            })
            res.json(created)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }

    async downloadFile (req, res) {
        try {
            console.log('req.params', req.query)
            console.log('req.params.id', req.query.id)
            const file = await File.findById(req.query.id)
            console.log('file', file)
            const path = `newFiles/${file.name}`
            return res.download(path, file.name)
            // return res.status(400).json({
            //     message: 'Download error'
            // })
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Download error"})
        }
    }
}

module.exports = new FileController()