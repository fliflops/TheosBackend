const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const api     = require('../api');

module.exports = async(app) => {
    //Load Headers
    app.use(morgan('dev'));
    app.use(cors())
    app.use(helmet());
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({extended:true}));
    

    app.use(api);
    
    app.listen(process.env.PORT || 50003, () => {
        console.log(`Server started on port ${process.env.PORT || 50003}`);
    });

    console.log('Express has been Initialized');
}
