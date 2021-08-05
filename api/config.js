const express = require('express');
const router = express.Router();

const configService = require('../services/config');

router.get('/', async (req, res) => {
    const config = await configService.retrieveConfig()
    
    res.status(200).json(config);
});

router.get('/v2', async (req,res) => {
    try{
        const config = await configService.retrieveConfigV3()
        res.status(200).json(config)
    }
    catch(e){
        console.log(e)
        res.status(500).json({
            message:`${e}`
        });
    }
})

router.put('/:truckType',async(req,res) => {
    const {truckType} = req.params;
    const {sm_drops,drops,capacity,radius} = req.body
    
    const update = await configService.updateConfiguration({
        drops,
        sm_drops,
        radius,
        capacity,
        truckType
    })   
    res.status(200).end();
})

//Resets Configuration
router.put('/',async(req,res) => {
    try{

        const configs = await configService.resetConfig()
        res.status(200).json({
            configs
        })

    }
    catch(e){
        console.log(e)
        res.status(500).json({
            message:`${e}`
        });
    }
})

module.exports = router;