const dataLayer = require('./dataLayer');

exports.updateConfiguration = async({
    drops,
    sm_drops,
    radius,
    capacity,
    truckType
}) => {
    return await dataLayer.updateConfiguration({
        drops,
        sm_drops,
        radius,
        capacity,
        truckType
    })
}

exports.retrieveConfig = async() => {
    return await dataLayer.retrieveConfigV2()
}

exports.resetConfig = async() => {
    try{

        return await dataLayer.resetConfig()

    }
    catch(e){
        throw e
    }
}
