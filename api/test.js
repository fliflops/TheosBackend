const express       = require('express');
const router        = express.Router();
const service = require('../services/crossdockReport');

router.get('/', async (req, res) => {
    try{

        const report = await service.crossdockReport({
            location:'Zeus',
            rdd:'2021-02-26'
        })

        res.status(200).json({
            report
        });
    }
    catch(e){
        res.status(500).json({
            message:`${e}`
        });
    }
   
});

module.exports = router;

