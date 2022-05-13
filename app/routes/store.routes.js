const express = require('express');
const cors = require('cors');
const router = express.Router();
const is_auth = require('../middlewares/is-auth');
const storeController = require('../controllers/store.controller');

router.use(cors());

router.post('/add-category', storeController.postCategory);

router.post('/add-sub-category', storeController.postSubCategory);

router.post('/add-child-sub-category', storeController.postChildSubCategory);

router.post('/add-item', storeController.postItem);

router.post('/add-banner', storeController.postBanner);

router.post('/add-poster', storeController.postPoster);

router.post('/create-blog', storeController.postBlog);

module.exports = router;