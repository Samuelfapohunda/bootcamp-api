const express = require('express');
const { 
    getBootcamps,
    getSingleBootcamp, 
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload,
getBootcampsInRadius } = require('../controllers/bootcamps')


const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults')


//Include other resource routers
const courseRouter = require('./courses')


 const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

 //Reroute into other resource routers 
 router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

 router
 .route('/')
 .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
 .post(protect, authorize('publisher', 'admin'), createBootcamp)


 router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)
 router
 .route('/:id')
 .get(getSingleBootcamp)
 .put(protect, authorize('publisher', 'admin'), updateBootcamp)
 .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)



  module.exports = router;
  