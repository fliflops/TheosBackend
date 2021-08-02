const expressLoader = require('./express');
//const dbLoader = require('./sequelize');

module.exports = async ({expressApp}) => {
    await expressLoader(expressApp);
    //await dbLoader();
}
