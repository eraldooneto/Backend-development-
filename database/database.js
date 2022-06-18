const Sequelize = require('sequelize');

const connection = new Sequelize('askGuide', 'root', 'Eraldoneto97.', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection; 