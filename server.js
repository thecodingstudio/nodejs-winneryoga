const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Define express server amd port.
const app = express();
const PORT = process.env.PORT || 8000;

// Importing routes.
const auth_route = require('./app/routes/auth.routes');
const user_route = require('./app/routes/user.routes');
const store_route = require('./app/routes/store.routes');
const customer_route = require('./app/routes/customer.routes');

// Multer setup.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },

    filename: function (req, file, cb) {
        cb(null, uuidv4().split('-')[4] + '_' + file.originalname);
    }
});

// Parse multer request.
app.use(multer({ storage: storage }).array('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Set headers for all requests.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Difine API routes.
app.use(auth_route);
app.use(user_route);
app.use('/store', store_route);
app.use('/customer', customer_route);

// Central error handling middleware.
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const ERROR_DATA = error.data || 'No data provided!';
    const ERROR_MESSAGE = error.message || error.error || 'Something went Wrong!';
    const ERROR_DESCRIPTION = error.description || error.error_description || 'No description provided!';
    error = { ERROR_MESSAGE: ERROR_MESSAGE, ERROR_DESCRIPTION: ERROR_DESCRIPTION, ERROR_DATA: ERROR_DATA, status: 0 }
    console.log(error);
    res.status(statusCode).json(error);
});

// Difine simple route.
app.get("/", (req, res) => {
    res.status(200).json({ message: 'Welcome to Winner-Yoga webapp backend..' });
});


// Define models and it's relationship.
const User = require('./app/models/user');
const Token = require('./app/models/token');
const Address = require('./app/models/address');
const Category = require('./app/models/category');
const Sub_category = require('./app/models/sub_category');
const Child_sub_category = require('./app/models/child_sub_category');
const Item = require('./app/models/item');
const Item_size = require('./app/models/item_size');
const Item_color = require('./app/models/item_color');
const Item_image = require('./app/models/item_image');
const Banner = require('./app/models/banner');
const Poster = require('./app/models/poster');

Token.belongsTo(User);
Address.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Sub_category.belongsTo(Category, { constraints: true, onDelete: 'CASCADE' });
Category.hasMany(Sub_category);
Child_sub_category.belongsTo(Sub_category, { constraints: true, onDelete: 'CASCADE' });
Sub_category.hasMany(Child_sub_category);
Item.belongsTo(Child_sub_category, { constraints: true, onDelete: 'CASCADE' });
Child_sub_category.hasMany(Item);
Banner.belongsTo(Child_sub_category, { constraints: true, onDelete: 'CASCADE' })
Child_sub_category.hasOne(Banner);
Item.belongsTo(Sub_category, { constraints: true, onDelete: 'CASCADE' });
Sub_category.hasMany(Item);
Item.belongsTo(Category, { constraints: true, onDelete: 'CASCADE' });
Category.hasMany(Item);
Item_image.belongsTo(Item, { constraints: true, onDelete: 'CASCADE' });
Item_size.belongsTo(Item, { constraints: true, onDelete: 'CASCADE' });
Item_color.belongsTo(Item, { constraints: true, onDelete: 'CASCADE' })
Item.hasMany(Item_image);
Item.hasMany(Item_size);
Item.hasMany(Item_color);
Item.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Item);
Poster.belongsTo(Item, { constraints: true, onDelete: 'CASCADE' })
Item.hasOne(Poster);

/*
 * Sync MySQL database.
 * Live to on defined port.
 */
const db = require("./app/utils/database");
db.sequelize
    .sync({ force: false })
    .then(_database => {
        console.log('Database Connected Successfully.')
    })
    .then((_result) => {
        app.listen(PORT, (_port) => {
            console.log('server running on port : ' + PORT);
        });
    })
    .catch(err => {
        console.log(err);
    });

module.exports = app;