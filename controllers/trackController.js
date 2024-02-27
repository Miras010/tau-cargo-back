const Track = require('../models/Track')
const UsersTrack = require('../models/UsersTrack')
const TrackService = require('./../services/trackService')
const jwt = require("jsonwebtoken");
const {secret} = require("../config");

class TrackController {
    async create (req, res) {
        try {
            const {trackNumber, receivedInChinaDate, fromChinaToAlmaty, receivedInAlmatyDate, receivedByClient, weight} = req.body
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: 'Не авторизован'})
            }
            const {id} = jwt.verify(token, secret)
            const track = await TrackService.create({trackNumber, receivedInChinaDate, fromChinaToAlmaty, receivedInAlmatyDate, receivedByClient, weight, createdBy: id})
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async upsertManyTracks (req, res) {
        try {
            const arrData = req.body
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: 'Не авторизован'})
            }
            const {id} = jwt.verify(token, secret)
            const track = await TrackService.upsertMany(arrData, id)
            res.status(200).json(track)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async getAll (req, res) {
        try {
            const { page = 1, limit = 10, globalFilter = '', filterBy, from, to} = req.query
            const posts = await TrackService.getAll({page, limit, globalFilter, filterBy, from, to})
            res.status(200).json(posts)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getAllByPartner (req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: 'Не авторизован'})
            }
            const {id} = jwt.verify(token, secret)
            const { page = 1, limit = 10, globalFilter = '', filterBy, from, to} = req.query
            const posts = await TrackService.getAllByPartner({page, limit, globalFilter, filterBy, from, to, createdBy: id})
            res.status(200).json(posts)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getTrackOwner (req, res) {
        try {
            const trackNumber = req.params.trackNumber
            const track = await Track.findOne({trackNumber})
            if (!track) {
                res.status(500).json('Трек код не найден')
            }
            const result = await UsersTrack.find({track: track._id}).populate('ownerId')
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getOne (req, res) {
        try {
            const track = await Track.findById(req.params.id)
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async deleteTrack (req, res) {
        try {
            const track = await Track.findByIdAndDelete(req.params.id)
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async updateTrack (req, res) {
        try {
            const updatedTrack = await TrackService.updateTrack(req.body)
            res.status(200).json(updatedTrack)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

}

module.exports = new TrackController()
