require('dotenv').config();
const { Sequelize } = require('sequelize');
const db = {};

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.USER_NAME, process.env.DATABASE_PASSWORD, {
    dialect: 'mysql',
    host: process.env.HOST_NAME,
    port: 3306,
    operatorAliases: false,

    pool: {
        max: 5, 
        min: 0, 
        acquire: 30000,
        idle: 10000
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;