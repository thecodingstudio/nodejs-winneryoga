const Sequelize = require('sequelize');
const db = require('../utils/database');

const Item = db.sequelize.define('item' , {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    short_discreption : {
        type: Sequelize.TEXT,
        defaultValue : "Descriprion not added!"
    },
    long_discreption : {
        type: Sequelize.TEXT,
        defaultValue : "Descriprion not added!"
    },
    order_count: {
        type: Sequelize.INTEGER(11),
        defaultValue : 0
    },
    is_favourite: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
    },
    is_test: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
    },
    is_verify: {
        type: Sequelize.TINYINT(1),
        defaultValue: 1
    },
    is_active: {
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

module.exports = Item;