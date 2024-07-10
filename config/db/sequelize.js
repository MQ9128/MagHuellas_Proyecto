const {Sequelize} = require('sequelize');

//creamos objeto ppasando como parametro
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,{
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

module.exports = sequelize;