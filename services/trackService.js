const Track = require("../models/Track");

class TrackService {
    async create (trackData) {
        const createdTrack = await Track.create(trackData)
        return createdTrack
    }

    async upsertMany (data, id) {
        const promises = []
        for (let item of data) {
            item.createdBy = id
            const asd = await Track.update(
                { trackNumber: item.trackNumber },
                { $set: item },
                { upsert: true })
            promises.push(asd)
        }
        return promises
    }

    async getAll (params) {
        const { page, limit, globalFilter, filterBy, from, to } = params
        let regex = ''
        if (globalFilter !== 'null') {
            regex = new RegExp(globalFilter, 'i')
        }
        if (filterBy !== 'null' &&  from !== 'null' && to !== 'null') {

        }
        const tracks = await Track.find({
            trackNumber: {$regex: regex},
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const count = await Track.count()
        return {
            resp: tracks,
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            currentPage: page
        }
    }

    async getAllByPartner (params) {
        const { page, limit, globalFilter, filterBy, from, to, createdBy } = params
        let regex = ''
        if (globalFilter !== 'null') {
            regex = new RegExp(globalFilter, 'i')
        }
        if (filterBy !== 'null' &&  from !== 'null' && to !== 'null') {

        }
        const tracks = await Track.find({
            trackNumber: {$regex: regex},
            createdBy: createdBy
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const count = await Track.count()
        return {
            resp: tracks,
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            currentPage: page
        }
    }



    async updateTrack (track) {
        if (!track._id) {
            throw new Error('Enter the id')
        }
        const updatedTrack = await Track.findByIdAndUpdate(track._id, track, {new: true})
        return updatedTrack
    }
}

module.exports = new TrackService()