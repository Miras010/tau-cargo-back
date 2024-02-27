const Track = require('../models/Track')
const Receipt = require('../models/Receipt')
const TrackService = require('./../services/trackService')
const ReceiptService = require('./../services/receiptService')
const jwt = require("jsonwebtoken");
const {secret} = require("../config");

class ReceiptController {
    async create (req, res) {
        try {
            const {receiver, weight, totalSum, totalNumber} = req.body
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: 'Не авторизован'})
            }
            const {id} = jwt.verify(token, secret)
            const track = await ReceiptService.create({receiver, weight, totalSum, totalNumber, createdBy: id})
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getAll (req, res) {
        try {
            const { page = 1, limit = 10, globalFilter = '', filterBy, from, to} = req.query
            const posts = await ReceiptService.getAll({page, limit, globalFilter, filterBy, from, to})
            res.status(200).json(posts)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getUserReceipts (req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: 'Не авторизован'})
            }
            const {id} = jwt.verify(token, secret)
            const posts = await ReceiptService.getUserReceipts(id)
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
            const { page = 1, limit = 10 } = req.query
            const posts = await ReceiptService.getAllByPartner({page, limit, createdBy: id})
            res.status(200).json(posts)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getOne (req, res) {
        try {
            const track = await Receipt.findById(req.params.id)
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async deleteReceipt (req, res) {
        try {
            const track = await Receipt.findByIdAndDelete(req.params.id)
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async updateReceipt (req, res) {
        try {
            const updatedTrack = await ReceiptService.update(req.body)
            res.status(200).json(updatedTrack)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

}

module.exports = new ReceiptController()