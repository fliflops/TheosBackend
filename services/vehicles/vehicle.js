const dataLayer = require('./dataLayer');

exports.retrieveVehicles = async({
    truckType
}) => {
    return await dataLayer.retrieveVehicles({
        truckType
    })
}

exports.retrieveShipTo = async ({
    shipTo
}) => {
    return await dataLayer.retrieveShipTo({
        shipTo
    })
}