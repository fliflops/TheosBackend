const dataLayer = require('./alexysDataLayer');
const sftpService = require('../sftp/sftpServices');
const moment = require('moment');

exports.getLoadedDataByLoadSheet = async(loadSheetNo) => {
    try{

        const result = await dataLayer.getLoadedDataByLoadSheet(loadSheetNo)

        return result
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}