const {Schema, model} = require('mongoose')

const File = new Schema({
    name: {type: String, required: true},
    date: {type: Date},
    statusKey: {type: String},
    statusValue: {type: String},
    type: {type: String, required: true},
    size: {type: String},
    createdDate: {type: Date, default: Date.now, required: true},
})

module.exports = model('File', File)