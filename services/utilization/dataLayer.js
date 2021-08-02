const models = require('../../models');
const {sequelize} = models;
const moment = require(`moment`);

exports.createUtilizationHeader = async ({
    delivery_date,
    from,
    to,	
    // config
}) => {
    try{
        
        const highest = await retrieveLast();
        let id;

        if(highest.length > 0 ){
            const {transction_id} = highest[0]
            const transId = transction_id.split('-')
            id = `${moment().format('MMDDYYYY')}-${parseInt(transId[transId.length-1])+1}`
        }
        else{
            id = `${moment().format('MMDDYYYY')}-1`
        }

        await models.utilization_header_tbl.create({
            transction_id: id,
            delivery_date,
            rdd_from:from,
            rdd_to:to,
            // config_id: config.id,
            date_created: moment().format('MM-DD-YYYY HH:mm:ss')
            // batch1_upper_limit:config.batch1_upper_limit,
            // batch1_lower_limit:config.batch1_lower_limit,
            // batch3_upper_limit:config.batch3_upper_limit,
            // batch3_lower_limit:config.batch3_lower_limit,
            // batch4_upper_limit:config.batch4_upper_limit,
            // batch4_lower_limit:config.batch4_lower_limit,
            // auv_drops:  config.auv_drops,
            // drops:  config.drops
        })
        
        console.log(id)
        return {
            transactionId: id
        }
    }
    catch(e){
        console.log(e)
    }
}

const retrieveLast = async () => {
    return await sequelize.query(`
        Select top 1 transction_id from utilization_header_tbl order by date_created desc
    `,{
        type:sequelize.QueryTypes.SELECT
    }) 
}

exports.bulkCreateUtilizedDetails = async({
    utilizedData
}) => {
    try{
        await models.utilization_details_tbl.bulkCreate(utilizedData)
    }
    catch(e){
        console.log(e)
    }
}   


exports.retrieveConfig = async () => {
    return await models.utilization_config_tbl.findAll().then(result => JSON.parse(JSON.stringify(result)))
}


exports.sp_report_utilization_drop_count = async ({
    transaction_id,
    rdd
}) => {
    return await sequelize.query(`
        sp_report_utilization_drop_count '${transaction_id}', '${rdd}'
    `,{
        type:sequelize.QueryTypes.SELECT
    })
    .then(result => {
        return JSON.parse(JSON.stringify(result))
    })
}

exports.sp_report_no_of_trucks_per_truck_types = async ({
    transaction_id,
    rdd
}) => {
    return await sequelize.query(`
        sp_report_no_of_trucks_per_truck_types '${transaction_id}', '${rdd}'
    `,{
        type:sequelize.QueryTypes.SELECT
    })
    .then(result => {
        return JSON.parse(JSON.stringify(result))
    })
}
