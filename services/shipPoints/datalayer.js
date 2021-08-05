const models = require('../../models');
const {sequelize,Sequelize} = models;

exports.validateShipTo = async({shipTolist}) => {
    try{

        return await sequelize.query(`sp_getNotExistStc_cdi '${typeof shipTolist !== 'undefined' ? shipTolist: ''}'`,
        {
            type:Sequelize.QueryTypes.SELECT,
            logging:false
        })

    }
    catch(e){
       throw e 
    }
}