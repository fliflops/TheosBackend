const dataLayer = require('./masterDataLayer');
const sftpService = require('../sftp/sftpServices');
const csv = require('csvtojson/v2');
const moment = require('moment');

exports.getShipPoints = async(filter) => {
    try{
        const { stc_inp } = filter;

        const bookings = await dataLayer.getShipPoints(filter)

        return bookings
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}


exports.getShipPointsPerRDD = async(rdd) => {
    try{

        const result = await dataLayer.getShipPointsPerRDD(rdd)

        return result
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.getBookingsByFilename = async(filter) => {
    try{
        const { filename } = filter;

        const bookings = await dataLayer.getBookingsByFilename(filter)

        return bookings
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.getBookingsByFilenameForODO = async(filter) => {
    try{
        const { filename } = filter;

        const bookings = await dataLayer.getBookingsByFilenameForODO(filter)

        return bookings
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.getProcessedOrdersFromRamco = async(filter) => {
    try{
        const { whLoc } = filter;

        const bookings = await dataLayer.getProcessedOrders(whLoc);

        return bookings
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.getAreaCodeList = async() => {
    try{
        const areaCodes = await dataLayer.getAreaCodeList();

        return areaCodes
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.csvToOrderTable = async() => {
    try{
        const copiedCSVFiles = await sftpService.copyCSVFilesFromSFTP();

        for(let file of copiedCSVFiles) {
            let jsonData = await csv().fromFile(file.copiedFilePath);
            await dataLayer.insertOrder(jsonData, file);
        }

        await sftpService.deleteFilesFromSFTP(copiedCSVFiles);
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.uploadCSVToOrderTable = async(file) => {
    try{
        //file = {
        // name 
        // uploadedFilePath
        //}

        let jsonData = await csv().fromFile(file.uploadedFilePath);
        await dataLayer.insertOrder(jsonData, file);
        
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.getSameFilename = async(filename) => {
    try{
        return await dataLayer.getSameFilename(filename);
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.getBookingsByFilenameForAlexysInterface = async(filename) => {
    try{

        const result = await dataLayer.getBookingsByFilenameForAlexysInterface(filename)

        return result
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}