const models = require('../../models');
const {sequelize}= models;

exports.crossdockReport = async ({
    location,
    rdd
}) => {
    try{
        const data = await sequelize.query(`
            sp_crossdock_report_exec '${rdd}','${location}'
        `,{
            type:sequelize.QueryTypes.SELECT
        })
        .then(result => JSON.parse(JSON.stringify(result)))

        return data
    }
    catch(e){
        console.log(e)
        throw e
    }
}