const express = require('express');
const cors = require('cors');
const router = express.Router();
const is_auth = require('../middlewares/is-auth');
const customerController = require('../controllers/customer.controller');

router.use(cors());

router.get('/get-homepage', customerController.getHomepage);

router.get('/get-featured-product', customerController.getFeatured);

router.get('/get-blog', customerController.getBlog);

router.get('/get-item', customerController.getItem);

module.exports = router;