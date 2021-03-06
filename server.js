const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Define express server amd port.
const app = express();
const PORT = process.env.PORT || 8000;

// Importing routes.
const auth_route = require('./app/routes/auth.routes');

// Multer setup.
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'images/');
//     },

//     filename: function (req, file, cb) {
//         cb(null, uuidv4().split('-')[4] + '_' + file.originalname);
//     }
// });

// Parse multer request.
// app.use(multer({ storage: storage }).array('image'));
// app.use('/images', express.static(path.join(__dirname, 'images')));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Set headers for all requests.
app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Difine API routes.
app.use(auth_route);

// Central error handling middleware.
app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    const data = error.data;
    const ErrorMessage = error.message || error.error;
    const ErrorDesc = error.description || error.error_description;
    res.status(statusCode).json({ ErrorMessage: ErrorMessage, ErrorDescription: ErrorDesc, data: data, status: 0 });
});

// Difine simple route.
app.get("/", (req, res) => {
    res.status(200).send('Welcome to Bulff City App backend..');
});

// Define models and it's relationship.
const User = require('./app/models/user');
const Token = require('./app/models/token');

Token.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

/*
 * Sync MySQL database.
 * Live to on defined port.
 */
const sequelize = require("./app/utils/database");
sequelize
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