const {Schema, model, ObjectId} = require('mongoose')

const UsersTrack = new Schema({
    ownerId: {type: ObjectId, ref: 'User', required: true},
    track: {type: ObjectId, ref: 'Track', required: true},
    description: {type: String, required: true},
    createdDate: {type: Date, default: Date.now }
})

module.exports = model('UsersTrack', UsersTrack)