const express=require('express');
const router=express.Router();
const CatchAsync=require('../utils/CatchAsync')
const { validateGym, isLoggedIn, isAuthor }=require('../middleware');
const gyms=require('../controllers/gyms')
const multer=require('multer')
const { storage }=require('../cloudinary')
const upload=multer({ storage })

router.route('/')
    .get(CatchAsync(gyms.index))
    // .post((req, res, next) => {
    //     console.log('postroute');
    //     next();
    // })
    .post(isLoggedIn, upload.array('images'), validateGym, CatchAsync(gyms.createGym));

router.get('/new', isLoggedIn, gyms.renderNewForm);

router.route('/:id')
    .get(CatchAsync(gyms.showGym))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateGym, CatchAsync(gyms.updateGym))
    .delete(isLoggedIn, isAuthor, CatchAsync(gyms.deleteGym));

router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(gyms.editGym));

module.exports=router;