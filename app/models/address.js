const Sequelize = require('sequelize');

const db = require('../utils/database');

const Address = db.sequelize.define('address', {
    company: {
        type: Sequelize.STRING(45),
        defaultValue : null
    },
    address: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    address_complement: {
        type: Sequelize.TEXT,
        defaultValue : null
    },
    city: {
        type: Sequelize.STRING(25),
        allowNull: false
    },
    state: {
        type: Sequelize.STRING(25),
        allowNull: false
    },
    zip_code: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    conutry: {
        type: Sequelize.STRING(25),
        allowNull: false
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
    }
}, {
    timestamps: true
});

module.exports = Address;