const Router = require('express')
const fileRouter = new Router()
const FileController = require('../controllers/fileController')

fileRouter.get('/getAll', FileController.getAll)
fileRouter.post('/upload', FileController.uploadFile)
fileRouter.get('/download', FileController.downloadFile)

module.exports = fileRouter