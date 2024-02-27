const Router = require('express')
const ReceiptController = require('../controllers/receiptController')
const roleMiddleware = require('./../middleware/roleMiddleware')

const receiptRouter = new Router()

receiptRouter.get('/getAll', roleMiddleware(['ADMIN', 'PARTNER']), ReceiptController.getAll)
receiptRouter.post('/create', roleMiddleware(['ADMIN', 'PARTNER']), ReceiptController.create)
receiptRouter.get('/getOne/:id', roleMiddleware(['ADMIN', 'PARTNER']), ReceiptController.getOne)
receiptRouter.put('/update', roleMiddleware(['ADMIN', 'PARTNER']), ReceiptController.updateReceipt)
receiptRouter.post('/delete/:id', roleMiddleware(['ADMIN', 'PARTNER']), ReceiptController.deleteReceipt)

receiptRouter.get('/partner/getAll', roleMiddleware(['PARTNER']), ReceiptController.getAllByPartner)
receiptRouter.get('/user/getAll', roleMiddleware(['USER']), ReceiptController.getUserReceipts)

module.exports = receiptRouter