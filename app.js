const express = require('express');
const path = require('path');

const loaders = require('./loaders');

global.__basedir = __dirname;

startServer = async () => {
    const app = express();

    await loaders({expressApp:app})

    // router.use('/', landingpage);
    // app.use(express.static(path.join(__dirname,'client/build')))

    // app.get('*', (req,res) =>{
    //     res.sendFile(path.join(__dirname+'/client/build/index.html'));
    // });

}

startServer();