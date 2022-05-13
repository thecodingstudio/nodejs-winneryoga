const Sequelize = require('sequelize');
const db = require('../utils/database');

const Poster = db.sequelize.define('poster' , {
    title: {
        type: Sequelize.STRING
    },
    description: {
        type : Sequelize.TEXT
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    is_test: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
    },
    is_delete: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
    },
    createdAt: {
        type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    },
    updatedAt: {
        type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    }
});

module.exports = Poster;