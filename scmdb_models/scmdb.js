const Sequelize = require('sequelize');
const fs = require('fs');

const config = require('../config/index');

var sequelize = new Sequelize(config.scmdbCredentials.database, 
                              config.scmdbCredentials.username, 
                              config.scmdbCredentials.password, {
        host: config.scmdbCredentials.host,
        dialect: 'mssql',
        dialectOptions: {
            useUTC: false, //for reading the database
            options: {
                requestTimeout: 3600000
            }
        },
        timezone: '+08:00', //for writing in the database
        pool: { 
            max: 1000000,
            min: 0,
            idle: 2000000,
            acquire: 2000000,
            idleTimeoutMillis: 50,
            evictionRunIntervalMillis: 5,
            softIdleTimeoutMillis: 5,
            logging: false
        }
    }
);

module.exports = sequelize;
exports.Sequelize = Sequelize;