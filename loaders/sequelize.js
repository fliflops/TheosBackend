const Sequelize = require('sequelize');
const config = require('../config');

module.exports = async() => {
    const {username,password,database} = config.development
    const sequelize = new Sequelize(database,username,password,config.development)
    try{
        await sequelize.authenticate()
        console.log('Successfully established a connection to Database')
    }
    catch(e){
        console.log('Error:' + e)
    }
    
    // await sequelize.authenticate()
    // .then(() => {
    //     console.log('Successfully established a connection to Database')
    // })
    // .catch(err => console.log('Error:' + err));
}