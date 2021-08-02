const { sequelize } = require('../../models');
const models = require('../../models');

exports.updateConfiguration = async({
    drops,
    sm_drops,
    radius,
    capacity,
    truckType
}) => {
    return await models.utilization_config_v2_tbl.update({
        drops,
        sm_drops,
        radius,
        capacity
    },{
        returning:true,
        where:{
            truck_type:truckType
        }
    })
}

exports.retrieveConfigV2 = async () => {
    return await sequelize.query(`sp_config_retrieve`,{
        type:sequelize.QueryTypes.SELECT
    })
    .then(result => JSON.parse(JSON.stringify(result)))
    // models.utilization_config_v2_tbl.findAll().then(result => JSON.parse(JSON.stringify(result)))
}

exports.resetConfig = async () => {
    try{
        return await sequelize.query(`
            sp_config_reset_defaults        
        `,{
            type:sequelize.QueryTypes.SELECT
        })
        .then(result => JSON.parse(JSON.stringify(result)))
    }
    catch(e){
        throw e
    }
}
