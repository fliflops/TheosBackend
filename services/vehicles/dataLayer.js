const models = require('../../models');
const {sequelize}= models;

exports.retrieveVehicles = async({
    truckType
}) => {
    return await sequelize.query(`
        Select * from vehicle_type_tbl
    `,{
        type:sequelize.QueryTypes.SELECT
    })
    .then(result => {
        return JSON.parse(JSON.stringify(result))
    })
}

exports.retrieveShipTo= async({
    shipTo
}) => {
    return await sequelize.query(`
        sp_ship_point_retrieve '${shipTo}'
    `,{
        type:sequelize.QueryTypes.SELECT
    })
    .then(result => {
        return JSON.parse(JSON.stringify(result))
    })
}


