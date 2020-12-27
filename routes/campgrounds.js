const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync')
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(CatchAsync(campgrounds.index))
    // .post((req, res, next) => {
    //     console.log('postroute');
    //     next();
    // })
    .post(isLoggedIn, upload.array('images'), validateCampground, CatchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(CatchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, CatchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campgrounds.editCampground));

module.exports = router;