const Track = require('../models/Track')
const UsersTrack = require('../models/UsersTrack')
const jwt = require("jsonwebtoken");
const {secret} = require("../config");

class UserTrackController {

    async followTrackByUser (req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: 'Не авторизован'})
            }
            const { id } = jwt.verify(token, secret)
            const { trackNumber, description } = req.body
            const track = await Track.findOne({ trackNumber })
            if (!track) {
                const createdTrack = await Track.create({trackNumber, createdBy: id})
                const temp = await UsersTrack.findOne({ownerId: id, track: createdTrack._id})
                if (temp) {
                    return res.status(400).json({message: 'Такой трек номер уже добавлен'})
                }
                const createdUsersTrack = await UsersTrack.create({ ownerId: id, track: createdTrack._id, description })
                return res.status(200).json(createdUsersTrack)
            }

            const temp = await UsersTrack.findOne({ownerId: id, track: track._id})
            if (temp) {
                return res.status(400).json({message: 'Такой трек номер уже добавлен'})
            }
            const createdUsersTrack = await UsersTrack.create({ ownerId: id, track: track._id, description })
            res.status(200).json(createdUsersTrack)
        } catch (e) {
            console.log('e', e)
            res.status(500).json(e)
        }
    }

    async getAllUserTracks (req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: 'Не авторизован'})
            }
            const { id } = jwt.verify(token, secret)
            const userTracks = await UsersTrack.find({ownerId: id}).populate('track')
            res.status(200).json(userTracks)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async unfollowUserTrack (req, res) {
        try {
            const track = await UsersTrack.findByIdAndDelete(req.params.id)
            if (track) {
                res.status(200).json(track)
            } else {
                res.status(500).json({message: 'Не удалось удалить!'})
            }
        } catch (e) {
            res.status(500).json(e)
        }
    }
}

module.exports = new UserTrackController()