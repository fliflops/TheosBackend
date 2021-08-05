const express       = require('express');
const router        = express.Router();
const fs            = require('fs');
const excel         = require('exceljs');
const _             = require('lodash');  
const moment        = require('moment');

const vehicleService = require('../services/vehicles');
const bookingService    = require('../services/bookings');
const utilizationService = require('../services/utilization');
const preAlertService   = require('../services/preAlert');
const configurationService = require('../services/config');
const utilizationServiceV2 = require('../services/utilization_v2');
const shipToService         = require('../services/shipPoints');

const utilizationServiceV3 = require('../services/utilization_v3');
const utilization_v4 = require('../services/utilization_v4');


router.put('/config', async (req,res) => {
        try{
            const {configData} = req.body;
    
            await configurationService.updateConfiguration({
                configData
            })
            res.status(200).end();
            
        }
        catch(e){
            res.status(500).end();
        }   
       
})

router.post('/v1',async(req,res) => {
    const {data,shipToCodes} = req.body;
    let mergedUtilized          = [];
    let dropCountReport         = [];
    let truckTypeCountReport    = [];
    let unAllocated             = [];

    const config2 = await configurationService.retrieveConfig();

    const vehicle = await vehicleService.retrieveVehicles({}); 

    const shipPoints = await vehicleService.retrieveShipTo({
        shipTo: shipToCodes
    });

    const preAlert = await preAlertService.retrieveBookingsPerStc({
        bookings:data,
        vehicle,
        shipPoints,
    });

    const {transactionId} = await utilizationService.createUtilizationHeader({
        delivery_date:_.min(preAlert.map(row => row.deliveryDate)),
        rdd_from:_.min(preAlert.map(row => row.deliveryDate)),
        rdd_to:_.max(preAlert.map(row => row.deliveryDate)),
        // config
    })

    const loopUtilize = preAlert.map(async item => {

        const {utilized,notAllocated} = await utilization_v4({
            bookings:       item.bookings,
            drops:          _.find(config2,item => item.truck_type === '6W').drops,
            fourWheelDrops: _.find(config2,item => item.truck_type === '4W').drops,
            l300Drops:      _.find(config2,item => item.truck_type === 'L300').drops,
            auvDrops:       _.find(config2,item => item.truck_type === 'AUV').drops,
            sedandrops:     _.find(config2,item => item.truck_type === 'Sedan').drops,
            
            radius:         _.find(config2,item => item.truck_type === '6W').radius,
            radius4W:       _.find(config2,item => item.truck_type === '4W').radius,
            radiusL300:     _.find(config2,item => item.truck_type === 'L300').radius,
            radiusAuv:      _.find(config2,item => item.truck_type === 'AUV').radius,
            radiusSedan:    _.find(config2,item => item.truck_type === 'Sedan').radius,

            smDrop:         _.find(config2,item => item.truck_type === '6W').sm_drops,
            smDrop4W:       _.find(config2,item => item.truck_type === '4W').sm_drops,
            smDropL300:     _.find(config2,item => item.truck_type === 'L300').sm_drops,
            smDropAuv:      _.find(config2,item => item.truck_type === 'AUV').sm_drops,
            smDropSedan:    _.find(config2,item => item.truck_type === 'Sedan').sm_drops,

            capacity:       _.find(config2,item => item.truck_type === '6W').capacity,
            capacity4W:     _.find(config2,item => item.truck_type === '4W').capacity,
            capacityL300:   _.find(config2,item => item.truck_type === 'L300').capacity,
            capacityAuv:    _.find(config2,item => item.truck_type === 'AUV').capacity,
            capacitySedan:  _.find(config2,item => item.truck_type === 'Sedan').capacity,
        })

        await utilizationService.bulkCreateUtilizedDetails({
            transcation_id:transactionId,
            utilized_data:utilized
        })

        //Generate Report 
        const sp_report_utilization_drop_count = await utilizationService.sp_report_utilization_drop_count({
            transaction_id:transactionId,
            rdd:item.deliveryDate
        })

        const sp_report_no_of_trucks_per_truck_types = await utilizationService.sp_report_no_of_trucks_per_truck_types({
            transaction_id:transactionId,
            rdd:item.deliveryDate
        })

        return{
            utilized,
            notAllocated,
            sp_report_utilization_drop_count,
            sp_report_no_of_trucks_per_truck_types
        }
    })

    await Promise.all(loopUtilize).then(result => {
        result.map(x => {
            x.utilized.map(y => {
                mergedUtilized.push({
                    ...y
                })
            })

            x.sp_report_no_of_trucks_per_truck_types.map(y => {
                truckTypeCountReport.push({
                    ...y
                })
            })

            x.sp_report_utilization_drop_count.map(y => {
                dropCountReport.push({
                    ...y
                })
            })

            x.notAllocated.map(y => {
                unAllocated.push({
                    ...y
                })
            })
        })  
    })

    const excel = await preAlertService.exportUtilizedToExcel({
        newerTrip: mergedUtilized,
        newerUnplanned:unAllocated,
        sp_report_no_of_trucks_per_truck_types:truckTypeCountReport,
        sp_report_utilization_drop_count:dropCountReport
    })

    res.download(excel); 
})

router.post('/v2', async(req,res) => {

   try{
    const {data,shipToCodes} = req.body;
    let mergedUtilized          = [];
    let dropCountReport         = [];
    let truckTypeCountReport    = [];
    let unAllocated             = [];

    const notExistShipto = await shipToService.validateShipTo({shipTolist:shipToCodes});
    if(notExistShipto.length > 0){
        return res.status(404).json({
            message:`STC not exists ${notExistShipto.map(item => item.value).join(',')}`
        })
    }
    
    const config2 = await configurationService.retrieveConfig();
    
    const vehicle = await vehicleService.retrieveVehicles({
            // truckType:'6W'
    }); 

    const shipPoints = await vehicleService.retrieveShipTo({
        shipTo: shipToCodes
    });

    const preAlert = await preAlertService.retrieveBookingsPerStc({
        bookings:data,
        vehicle,
        shipPoints,
    });

    const {transactionId} = await utilizationService.createUtilizationHeader({
        delivery_date:  _.min(preAlert.map(row => row.deliveryDate)),
        rdd_from:       _.min(preAlert.map(row => row.deliveryDate)),
        rdd_to:         _.max(preAlert.map(row => row.deliveryDate)),
        // config
    })

    const loopUtilize = preAlert.map(async item => {

        const {utilized,notAllocated} = await utilizationServiceV3({
            bookings:       item.bookings,
            drops:          _.find(config2,item => item.truck_type === '6W').drops,
            fourWheelDrops: _.find(config2,item => item.truck_type === '4W').drops,
            l300Drops:      _.find(config2,item => item.truck_type === 'L300').drops,
            auvDrops:       _.find(config2,item => item.truck_type === 'AUV').drops,
            sedandrops:     _.find(config2,item => item.truck_type === 'Sedan').drops,
            
            radius:         _.find(config2,item => item.truck_type === '6W').radius,
            radius4W:       _.find(config2,item => item.truck_type === '4W').radius,
            radiusL300:     _.find(config2,item => item.truck_type === 'L300').radius,
            radiusAuv:      _.find(config2,item => item.truck_type === 'AUV').radius,
            radiusSedan:    _.find(config2,item => item.truck_type === 'Sedan').radius,

            smDrop:         _.find(config2,item => item.truck_type === '6W').sm_drops,
            smDrop4W:       _.find(config2,item => item.truck_type === '4W').sm_drops,
            smDropL300:     _.find(config2,item => item.truck_type === 'L300').sm_drops,
            smDropAuv:      _.find(config2,item => item.truck_type === 'AUV').sm_drops,
            smDropSedan:    _.find(config2,item => item.truck_type === 'Sedan').sm_drops,

            capacity:       _.find(config2,item => item.truck_type === '6W').capacity,
            capacity4W:     _.find(config2,item => item.truck_type === '4W').capacity,
            capacityL300:   _.find(config2,item => item.truck_type === 'L300').capacity,
            capacityAuv:    _.find(config2,item => item.truck_type === 'AUV').capacity,
            capacitySedan:  _.find(config2,item => item.truck_type === 'Sedan').capacity,

            capacityLimit:  _.find(config2,item => item.truck_type === '6W').capacity_start_limit,
            capacityLimit4W:_.find(config2,item => item.truck_type === '4W').capacity_start_limit,
            capacityLimitL300:_.find(config2,item => item.truck_type === 'L300').capacity_start_limit,
            capacityLimitAuv: _.find(config2,item => item.truck_type === 'AUV').capacity_start_limit,
            capacityLimitSedan:_.find(config2,item => item.truck_type === 'Sedan').capacity_start_limit   
        })

        await utilizationService.bulkCreateUtilizedDetails({
            transcation_id:transactionId,
            utilized_data:utilized
        })

        //Generate Report 
        const sp_report_utilization_drop_count = await utilizationService.sp_report_utilization_drop_count({
            transaction_id:transactionId,
            rdd:item.deliveryDate
        })

        const sp_report_no_of_trucks_per_truck_types = await utilizationService.sp_report_no_of_trucks_per_truck_types({
            transaction_id:transactionId,
            rdd:item.deliveryDate
        })

        return{
            utilized,
            notAllocated,
            sp_report_utilization_drop_count,
            sp_report_no_of_trucks_per_truck_types
        }
    })

    await Promise.all(loopUtilize).then(result => {
        result.map(x => {
            x.utilized.map(y => {
                mergedUtilized.push({
                    ...y
                })
            })

            x.sp_report_no_of_trucks_per_truck_types.map(y => {
                truckTypeCountReport.push({
                    ...y
                })
            })

            x.sp_report_utilization_drop_count.map(y => {
                dropCountReport.push({
                    ...y
                })
            })

            x.notAllocated.map(y => {
                unAllocated.push({
                    ...y
                })
            })
        })  
    })

    const excel = await preAlertService.exportUtilizedToExcel({
        newerTrip: mergedUtilized,
        newerUnplanned:unAllocated,
        sp_report_no_of_trucks_per_truck_types:truckTypeCountReport,
        sp_report_utilization_drop_count:dropCountReport
    })

    res.download(excel); 
   }
   catch(e){
        console.log(e)
        res.status(500).json({
            message:`${e}`
        })
    }

})


module.exports = router;