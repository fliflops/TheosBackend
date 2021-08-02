const Client = require('ssh2-sftp-client');
const moment = require('moment')
const path = require('path')
const fs = require('fs')

exports.retrieveListOfFilesFromSFTP = async (config) => {
    //filter =
        //config

    let sftp = new Client("client");
    const dir = '/D:/logsftp/Glovis/ORDERS/';

    try {
        await sftp.connect(config);
        console.log("Connected to sftp..");
        let orderList = await sftp.list(dir);

        var orderArrayList = await (orderList.filter((item) => { //filter only the files using '-' type
                return item.type == '-' && item.name.toUpperCase().includes(".CSV");
            }).map((file) => {
                return { "name" : file.name, 
                         "type" : "ORDER", 
                         "size" : (file.size*0.001).toFixed(3) +' kb', 
                         "date" : moment(file.modifyTime).format("DD MMM YYYY hh:mm a")}})
        )
        return orderArrayList
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.copyFilesFromSFTP = async (config) => {
    //filter =
        //config

    let sftp = new Client("client");
    const dir = '/D:/logsftp/Glovis/ORDERS/';

    try {
        await sftp.connect(config);
        console.log("Connected to sftp..");
        let fileList = await sftp.list(dir);

        var orderArrayList = await (fileList.filter((item) => { //filter only the files using '-' type
                return item.type == '-' && item.name.toUpperCase().includes(".CSV");
            }).map((file) => {
                return { "name" : file.name, 
                         "type" : "ORDER", 
                         "size" : (file.size*0.001).toFixed(3) +' kb', 
                         "date" : moment(file.modifyTime).format("DD MMM YYYY hh:mm a"),
                         "remotePath" : dir}})
        )
        const copiedCSVLocally = [];

        for(let file of orderArrayList) { //##loop to create a copy of files in the local app server
            let srcPath = `${dir}${file.name}`; //## source path of the file
            let chosenPath = path.join(__dirname, '../../resources/'); //## for we are in action folder, go prev folder then go to files folder
            let trgtPath = fs.createWriteStream(`${chosenPath}${file.name}`); //## create a writeStream destination

            await sftp.get(srcPath, trgtPath).then(() => { //## get a copy of remote file
                copiedCSVLocally.push({...file, "copiedFilePath" : trgtPath.path});
            });
        }

        return copiedCSVLocally;
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.deleteFileFromSFTP = async(config, remotePathFile) => {
    //filter =
        //config
        //remoteFilePath

    let sftp = new Client("client");

    try {
        await sftp.connect(config);
        await sftp.delete(remotePathFile);
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.insertFileToSFTP = async(config, localFilePath, remotePathFile) => {
    //filter =
        //config
        //localFilePath
        //remoteFilePath

    let sftp = new Client("client");

    try {
        await sftp.connect(config);
        let result = await sftp.fastPut(localFilePath, remotePathFile);
        if(result.includes('was successfully uploaded to')) {
            console.log(`Inserted remote file ${remotePathFile}`)
            return true 
        }
        return false
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}