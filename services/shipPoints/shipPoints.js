const dataLayer = require('./datalayer');


exports.validateShipTo = async({shipTolist})=>{
    try{

        return await dataLayer.validateShipTo({shipTolist})

    }
    catch(e){
       throw e 
    }
}