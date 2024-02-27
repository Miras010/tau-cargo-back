const {Schema, model, ObjectId} = require('mongoose')

const Track = new Schema({
    trackNumber: {type: String, required: true, unique: true},
    fileName: String,
    receivedInChinaDate: Date,
    receivedInAlmatyDate: Date,
    fromChinaToAlmaty: Date,
    receivedByClient: Date,
    shippedFromAlmatyDate: Date,
    createdDate: {type: Date, default: Date.now, required: true},
    createdBy: {type: ObjectId, required: true, ref: 'User'},
})

module.exports = model('Track', Track)