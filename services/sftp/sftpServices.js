const dataLayer = require('./sftpDataLayer');
const bookingService = require('../bookings');
const config = require('../../config');
const fs = require('fs');

exports.retrieveListOfFilesFromSFTP = async() => {
    try{
        const { sftpCredentials } = config;

        const listOfFilesFromSFTP = await dataLayer.retrieveListOfFilesFromSFTP(sftpCredentials);

        return listOfFilesFromSFTP
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.copyCSVFilesFromSFTP = async() => {
    try{
        const { sftpCredentials } = config;

        const listOfCopiedFilesFromSFTP = await dataLayer.copyFilesFromSFTP(sftpCredentials);

        return listOfCopiedFilesFromSFTP
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.insertFileToSFTP = async(localFilePath, remoteFilePath) => {
    try{
        const { sftpCredentials } = config;
        if(fs.existsSync(localFilePath)) {
            await dataLayer.insertFileToSFTP(sftpCredentials, localFilePath, remoteFilePath);
            return true
        }
        else {
            return false
        }
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.deleteFilesFromSFTP = async(files) => {
    try{

        const { sftpCredentials } = config;

        for(let file of files) {
            let filter = { 'filename' : file.name };
            let remoteFilePath = `${file.remotePath}/${file.name}`

            const existInLocal = fs.existsSync(file.copiedFilePath)
            const maintainedInOrderTable = await bookingService.getBookings(filter);

            if(existInLocal && maintainedInOrderTable) {
                await dataLayer.deleteFileFromSFTP(sftpCredentials, remoteFilePath);
            }
        }

    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}