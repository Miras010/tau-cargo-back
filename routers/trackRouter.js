const Router = require('express')
const TrackController = require('../controllers/trackController')
const UserTrackController = require('../controllers/userTrackController')
const authMiddleware = require('./../middleware/authMiddleware')
const roleMiddleware = require('./../middleware/roleMiddleware')

const trackRouter = new Router()

trackRouter.get('/getAll', roleMiddleware(['ADMIN', 'PARTNER']), TrackController.getAll)
trackRouter.get('/partner/getAll', roleMiddleware(['ADMIN', 'PARTNER']), TrackController.getAllByPartner)
trackRouter.post('/create', roleMiddleware(['ADMIN', 'PARTNER']), TrackController.create)
trackRouter.post('/upsertMany', roleMiddleware(['ADMIN', 'PARTNER']), TrackController.upsertManyTracks)
trackRouter.get('/getOne/:id', roleMiddleware(['ADMIN', 'PARTNER']), TrackController.getOne)
trackRouter.put('/update', roleMiddleware(['ADMIN', 'PARTNER']), TrackController.updateTrack)
trackRouter.post('/delete/:id', roleMiddleware(['ADMIN', 'PARTNER']), TrackController.deleteTrack)
trackRouter.get('/getOwner/:trackNumber', TrackController.getTrackOwner)

trackRouter.post('/user/follow', roleMiddleware(['ADMIN', 'USER']), UserTrackController.followTrackByUser)
trackRouter.get('/user/getAll', roleMiddleware(['ADMIN', 'USER']), UserTrackController.getAllUserTracks)
trackRouter.post('/user/delete/:id', roleMiddleware(['ADMIN', 'USER']),UserTrackController.unfollowUserTrack)

module.exports = trackRouter
