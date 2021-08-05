const _             = require('lodash');
const dataLayer     = require('./dataLayer');
const matrixService = require('../matrix');
const moment        = require('moment');

exports.utilization = async ({
     bookings,
     config
}) => {
    try{

        let utilized = [];

        // let batch0 = await batch0Coload({bookings})

        // const matrix = await matrixService.matrix({
        //     dropCount:drops
        // })

        // ///Batch 1
        // const batch1 = await retrieveFirstDrop({
        //     higherLimit: config.batch1_upper_limit,
        //     lowerLimit: config.batch1_lower_limit,
        //     bookings,
        //     utilized:utilized,
        //     isSM: false
        // })

        // batch1.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // //Batch 0 First Drop
        // const batch0_batch1_firstDrop = await retrieveFirstDrop({
        //     higherLimit: config.batch1_upper_limit,
        //     lowerLimit: config.batch1_lower_limit,
        //     bookings: batch0.filter(i => !utilized.map(x => x.id).includes(i.id)),
        //     utilized:utilized,
        //     isSM: false
        // })

        // batch0_batch1_firstDrop.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // //Batch 2
        // const batch2 =  await retrieveAllDrops_cluster_1({
        //     bookings,
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:2
        // })

        // batch2.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch2_batch0 =  await retrieveAllDrops_cluster_1({
        //     bookings:batch0.filter(i => !utilized.map(x => x.id).includes(i.id)),
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:2
        // })

        // batch2_batch0.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // //Batch 3

        // const batch3_firstDrop =await retrieveFirstDrop({
        //     higherLimit: config.batch3_upper_limit,
        //     lowerLimit: config.batch3_lower_limit,
        //     bookings,
        //     utilized:utilized,
        //     isSM: true
        // })

        // batch3_firstDrop.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch3_batch0_firstDrop =await retrieveFirstDrop({
        //     higherLimit: config.batch3_upper_limit,
        //     lowerLimit: config.batch3_lower_limit,
        //     bookings: batch0.filter(i => !utilized.map(x => x.id).includes(i.id)),
        //     utilized:utilized,
        //     isSM: true
        // })

        // batch3_batch0_firstDrop.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch3_coload_city = await retrieveAllDrops_city_1({
        //     bookings,
        //     matrix,
        //     utilized:utilized,
        //     range:5,
        //     drops,
        //     batch:3
        // });

        // batch3_coload_city.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch3_batch0_coload_city = await retrieveAllDrops_city_1({
        //     bookings: batch0.filter(i => !utilized.map(x => x.id).includes(i.id)),
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:3
        // });

        // batch3_batch0_coload_city.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })
    
        // const batch3_remaining_coload_city = await retrieveRemDrops_city({
        //     bookings,
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:3
        // })

        // batch3_remaining_coload_city.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch3_batch_0_remaining_coload_city = await retrieveRemDrops_city({
        //     bookings: batch0.filter(i => !utilized.map(x => x.id).includes(i.id)),
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:3
        // })

        // batch3_batch_0_remaining_coload_city.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch4_firstDrop = await retrieveFirstDrop({
        //     higherLimit: config.batch4_upper_limit,
        //     lowerLimit: config.batch4_lower_limit,
        //     bookings,
        //     utilized:utilized,
        //     isSM: false
        // })

        // batch4_firstDrop.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch4__batch0_firstDrop = await retrieveFirstDrop({
        //     higherLimit: config.batch4_upper_limit,
        //     lowerLimit: config.batch4_lower_limit,
        //     bookings: batch0.filter(i => !utilized.map(x => x.id).includes(i.id)),
        //     utilized:utilized,
        //     isSM: false
        // })

        // batch4__batch0_firstDrop.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch4_AllDrops_cluster = await retrieveAllDrops_cluster_1({
        //     bookings,
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:4
        // })

        // batch4_AllDrops_cluster.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch4_batch0_AllDrops_cluster = await retrieveAllDrops_cluster_1({
        //     bookings,
        //     matrix,
        //     utilized:batch0.filter(i => !utilized.map(x => x.id).includes(i.id)),
        //     range:config.range,
        //     drops:config.drops,
        //     batch:4
        // })

        // batch4_batch0_AllDrops_cluster.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        
        // const batch4_AllDrops_city = await retrieveAllDrops_city_1({
        //     bookings,
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:4
        // })

        // batch4_AllDrops_city.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch4_batch0_AllDrops_city = await retrieveAllDrops_city_1({
        //     bookings: batch0.filter(i => !utilized.map(x => x.id).includes(i.id)),
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:4
        // })

        // batch4_batch0_AllDrops_city.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })
 
        // const batch4_remaining_coload_city = await retrieveRemDrops_city({
        //     bookings,
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:4
        // })

        // batch4_remaining_coload_city.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // const batch4_batch0_remaining_coload_city = await retrieveRemDrops_city({
        //     bookings: batch0.filter(i => !utilized.map(x => x.id).includes(i.id)),
        //     matrix,
        //     utilized:utilized,
        //     range:config.range,
        //     drops:config.drops,
        //     batch:4
        // })

        // batch4_batch0_remaining_coload_city.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        // console.log(batch0.filter(i => !utilized.map(x => x.id).includes(i.id)))

        // const batch0FirstDrop = await batch0_firstDrop({
        //     bookings,
        //     utilized
        // })

        // batch0FirstDrop.map(x => {
        //     utilized.push({
        //         ...x
        //     })
        // })

        //## reassign the value of bookings by dividing it base on upper limit
        bookings = await breakdownBookings({
            bookings,
            upper_limit:config.batch1_upper_limit
        });

        //## reassign the value of bookings by dividing it base on upper limit
        utilized = await sixWheel_truck_planning({
            bookingss:bookings,
            drops:config.drops,
            lowerLimit: config.batch3_lower_limit,
            higherLimit: config.batch3_upper_limit,
        })

        //## Tagging of vehicle type for prospect 4W/L300 (base on the sum of the util in the same truck no)
        utilized.map(a => {
            (truckFor4W_L300(utilized,config.drops))
            .map(b => {
                if(a.truck_no === b.truckNo){
                    a.truck_type = b.truckType
                }
            })
        })

        //## Coloading other STCs to 4W/L300 truck types
        let { newTrip, newUnplanned } = await coload_4WL300({
            trip:_.orderBy(utilized,'truck_no','asc'),
            unPlanned:unUtilized({
                bookings,
                utilized:utilized
            }),
            drops:config.drops
        })

        let { newerTrip, newerUnplanned } = await batch6_truck_planning({
            newTrip,
            newUnplanned,
            auvMaxDrops:config.auv_drops
        })

        return{
            newerTrip,
            newerUnplanned
        }
    }
    catch(e){
        console.log(e)
    }
}

exports.createUtilizationHeader = async ({
    delivery_date,	
    // config
}) => {
    const {transactionId} = await dataLayer.createUtilizationHeader({
        delivery_date,	
        // config
    })

    return {
        transactionId
    }
}

exports.retrieveConfig = async() => {
    return await dataLayer.retrieveConfig()
}

exports.insertToDB = async({
    utilized_data,
    rdd,
    config
}) => {

    const {transactionId} = await dataLayer.createUtilizationHeader({
        delivery_date:rdd,	
        config
    })

    await dataLayer.bulkCreateUtilizedDetails({
            utilizedData:utilized_data.map(item => {
                return {				
                    transcation_id: transactionId,		
                    rdd:            item.rdd,				
                    ship_to_code:   item.ship_to_code,		
                    consignee_id:   item.consignee_id,		
                    cluster:        item.cluster,	
                    city:           item.city,	
                    total_cbm:      item.total_cbm,	
                    total_wt:       item.total_wt,	
                    truck_cbm_util: item['6W_cbm_util'],	
                    truck_wt_util:  item['6W_wt_util'],	
                    util_factor:    item['Util_factor'],	
                    truck_type:     item.truck_type,	
                    truck_no:       item.truck_no,	
                    drop:           item.drop,	
                    creted_date:    moment().format('MM-DD-YYYY HH:mm:ss')
                }
            }
        )}
    )
}

exports.bulkCreateUtilizedDetails =  async({
    transcation_id,
    utilized_data
}) => {

    // console.log(utilized_data)
    try{
        await dataLayer.bulkCreateUtilizedDetails({
            utilizedData:utilized_data.map(item => {
                return {				
                    transcation_id,		
                    rdd:            item.rdd,				
                    ship_to_code:   item.ship_to_code,		
                    consignee_id:   item.consignee_id,		
                    cluster:        item.cluster,	
                    city:           item.city,	
                    total_cbm:      item.total_cbm,	
                    total_wt:       item.total_wt,	
                    truck_cbm_util: item['6W_cbm_util'],	
                    truck_wt_util:  item['6W_wt_util'],	
                    util_factor:    item['Util_factor'],	
                    truck_type:     item.truck_type,	
                    truck_no:       item.truck_no,	
                    drop:           item.drop,	
                    creted_date:    moment().format('MM-DD-YYYY HH:mm:ss')
                }
            })
        })
    }
    catch(e){
        console.log(e)
        throw new Error(e)
    }

   
}

exports.sp_report_utilization_drop_count = async({
    transaction_id,
    rdd
}) => {
    return await dataLayer.sp_report_utilization_drop_count({
        transaction_id,
        rdd
    })
}

exports.sp_report_no_of_trucks_per_truck_types = async({
    transaction_id,
    rdd
}) => {
    return await dataLayer.sp_report_no_of_trucks_per_truck_types({
        transaction_id,
        rdd
    })
}


const truckFor4W_L300 = (plannedDrops, drops) => {
    let groupbyTruckNo = _.groupBy(plannedDrops,'truck_no')
    let test = [];

    Object.keys(groupbyTruckNo).map(truckNo => {
        const data = groupbyTruckNo[truckNo]
        const sumUtilFactor = _.sumBy(data,'Util_factor')
        let truckType;

        if(sumUtilFactor <= 47.8873239 && data.length < drops) {
            truckType = '4W/L300'
        }

        if(typeof truckType !== 'undefined'){
            test.push({
                truckNo:parseInt(truckNo),
                sumUtilFactor,
                truckType
            })
        }
    })

    return test
}
 

const retrieveRemDrops_city = ({
    bookings,
    matrix,
    utilized,
    range,
    drops,
    batch
}) => {
    let temp = [];
    let validTrips =[];

    const groupbyTruck = _.groupBy(utilized,'truck_no')
    Object.keys(groupbyTruck).map(truck => {
    
        const trips = groupbyTruck[truck]
        if(trips.length < drops){
            const firstDrop = _.minBy(trips,'drop')
            const lastDrop = _.maxBy(trips,'drop')

            const unPlanned = unUtilized({bookings,utilized})
            //console.log({firstDrop})

            const mtx = matrix.filter(a => {
                return firstDrop.Util_factor >= a.drop_1 - range && firstDrop.Util_factor <= a.drop_1
            })

            if(lastDrop.drop > 1){
                //console.log(lastDrop)
                for(let i = 3; i <= drops;i++){
                    for(let a of mtx){
                        const utl = unPlanned.filter(item => {
                            return  (item.Util_factor >= a[`drop_${i}`] - range && item.Util_factor <= a[`drop_${i}`])
                            &&      (item.city === firstDrop.city)
                            &&      (!item.is_Drop1)
                        })

                        if(utl.length > 0){
                            const sumUtil = _.sumBy(trips,'Util_factor')
                            const filter = _.orderBy(utl.filter(x => {
                                return !temp.map(y => y.id).includes(x.id)
                                && typeof x.truck_no === 'undefined'
                                && (sumUtil + x.Util_factor + _.sumBy(temp.filter(x => x.truck_no === lastDrop.truck_no),'Util_factor')) <= 100
                            }),['Util_factor'],['desc'])

                            if(typeof filter !== 'undefined'){
                                const highest = _.maxBy(filter,'Util_factor')
                              
                                if(typeof highest !== 'undefined'){
                                   // const maxTemp = _.sumBy(temp.filter(x => x.truck_no === '5'),'Util_factor')

                                    highest['sequence_id'] = a.sequence_id
                                    highest['truck_type'] = '6W'
                                    highest['truck_no'] = parseInt(lastDrop.truck_no)
                                    highest['drop'] = i
                                    
                                
                                    temp.push({
                                    ...highest
                                    })

                                    break;
                                }
                            }
                        }
                    }
                }   
            }
        }
    })
    return temp
}

const retrieveAllDrops_city_1 = ({
    bookings,
    matrix,
    utilized,
    range,
    drops, 
    batch
}) => {
   // console.log(`start of batch`,batch)
    let tempUtilized = utilized
    let temp = []
    const city = [...new Set(tempUtilized.map(i => i.city))]
    const parseDrop = parseInt(drops)
    city.map(city => {
        // console.log(`City: ${city}`)

        //Group Trips by Truck No
        const groupByTruckNo = _.groupBy(utilized.filter(item => item.city === city),'truck_no')

        //Loop through groupByTruckNo and retrieve the last drop per truck
        Object.keys(groupByTruckNo).map(truckNo => {
            const lastDrop = _.maxBy(groupByTruckNo[truckNo],'drop')

           // console.log(lastDrop)
            if(lastDrop.drop < parseDrop){
                const unPlanned = unUtilized({bookings,utilized})
                if(typeof lastDrop.sequence_id === 'undefined'){
                    const mtx = matrix.filter(a => {
                        return lastDrop.Util_factor >= a.drop_1 - range && lastDrop.Util_factor <= a.drop_1
                    })

                    for(let i = 2; i <= parseDrop; i++){
                        for(let a of mtx){
                            // console.log({[`drop_${i}`]: a[`drop_${i}`]})
                            const utl = unPlanned.filter(item => {
                                return  (item.Util_factor >= a[`drop_${i}`] - range && item.Util_factor <= a[`drop_${i}`])
                                &&      (item.city === city)
                                &&      (!item.is_Drop1)
                            })

                            if(utl.length > 0){
                                
                                const highest = _.maxBy(
                                    utl.filter(x => {
                                        return !temp.map(y => y.id).includes(x.id)
                                    }),
                                'Util_factor')

                                if(typeof highest !== 'undefined'){
                                    highest['sequence_id'] = a.sequence_id
                                    highest['truck_type'] = '6W'
                                    highest['truck_no'] = parseInt(truckNo)
                                    highest['drop'] = i
                                    
                                    
                                    if(i > 2){
                                        const test = temp.filter(x => {
                                            return  (x.truck_no === parseInt(truckNo))
                                            &&      (x.drop === i-1)
                                        })

                                        const validate = _.maxBy(utilized.filter(item => item.truck_no ===  parseInt(truckNo)),'drop')
                                        if(validate.drop !== parseDrop){
                                            if(test.length > 0){
                                                const filter = _.orderBy(utl.filter(x => {
                                                    return !temp.map(y => y.id).includes(x.id)
                                                    && typeof x.truck_no === 'undefined'
                                                }),['Util_factor'],['desc'])
                                                const sumUtil = lastDrop.Util_factor + test[0].Util_factor
                                                
                                                for(let c of filter){
                                                    if((sumUtil + c.Util_factor) <= 100 ){
                                                        temp.push({
                                                            ...c,
                                                            sequence_id : a.sequence_id,
                                                            truck_type  : '6W',
                                                            truck_no    : parseInt(truckNo),
                                                            drop        : i
                                                        })
                                                        break;
                                                    }
                                                   
                                                }
                                            }
                                        }

                                    }
                                    else{
                                        const validate = _.maxBy(utilized.filter(item => item.truck_no ===  parseInt(truckNo)),'drop')
                                     
                                        if(validate.drop !== parseDrop){
                                            temp.push({
                                                ...highest
                                            })
                                        }
                                    }

                                break;
                                }
                            }
                        }
                    }
                }
            }
        })
    })

    return temp
}

const retrieveAllDrops_cluster_1 = ({
    bookings,
    matrix,
    utilized,
    range,
    drops,
    batch
}) => {

// console.log(`Start: ${batch}`)
    let tempUtilized = utilized
    let temp = []
    const cluster = [...new Set(tempUtilized.map(i => i.cluster_code))]
    const parseDrop = parseInt(drops)
    const group = _.groupBy(utilized,'truck_no')
    let trucks = []
    Object.keys(group).map(truckNo => {
        const data = group[truckNo]

        if(data.length < drops){
            trucks.push(parseInt(truckNo))
        }
    })
    
    cluster.map(cluster => {

        //Group Trips by Truck No
        const groupByTruckNo = _.groupBy(utilized.filter(item =>
            {return item.cluster_code === cluster &&
                (trucks.includes(item.truck_no))
            }),'truck_no')

        //Loop through groupByTruckNo and retrieve the last drop per truck
        Object.keys(groupByTruckNo).map(truckNo => {
            const lastDrop = _.maxBy(groupByTruckNo[truckNo],'drop')

            // console.log(lastDrop)
            if(lastDrop.drop < parseDrop){
                const unPlanned = unUtilized({bookings,utilized})
                if(typeof lastDrop.sequence_id === 'undefined'){
                    const mtx = matrix.filter(a => {
                        return lastDrop.Util_factor >= a.drop_1 - range && lastDrop.Util_factor <= a.drop_1
                    })

                    for(let i = 2; i <= parseDrop; i++){
                        for(let a of mtx){

                            const utl = unPlanned.filter(item => {
                                return  (item.Util_factor >= a[`drop_${i}`] - range && item.Util_factor <= a[`drop_${i}`])
                                &&      (item.cluster_code === cluster)
                                &&      (!item.is_Drop1)
                            })

                            if(utl.length > 0){
                                const highest = _.maxBy(
                                    utl.filter(x => {
                                        return !temp.map(y => y.id).includes(x.id)
                                    }),
                                'Util_factor')

                                if(typeof highest !== 'undefined'){

                                    highest['sequence_id'] = a.sequence_id
                                    highest['truck_type'] = '6W'
                                    highest['truck_no'] = parseInt(truckNo)
                                    highest['drop'] = i

                                    //const validate = utilized

                                    if(i > 2){
                                        //console.log(i-1)
                                        const test = temp.filter(x => {
                                            return  (x.truck_no === parseInt(truckNo))
                                            &&      (x.drop === i-1)
                                        })
                                        

                                        if(test.length > 0){
                                            // const sumUtil = lastDrop.truck_no //+ test[0].Util_factor
                                            // console.log(sumUtil)
                                            temp.push({
                                                ...highest
                                            })
                                        }
                                    }
                                    else{
                                        //console.log(highest)
                                        temp.push({
                                            ...highest
                                        })
                                    }
                                    
                                break;
                                }
                            }
                        }
                    }
                }
            }
        })
    })

    return temp
}

const retrieveFirstDrop = ({
    higherLimit,
    lowerLimit,
    bookings,
    utilized,
    isSM
}) => {
    // console.log(isSM)
    let truckNo = typeof _.maxBy(utilized,'truck_no') === 'undefined' ? 0 : (_.maxBy(utilized,'truck_no')).truck_no

    const unUtilizedTrips = unUtilized({
        bookings,
        utilized
    })

    if(!isSM){
        return unUtilizedTrips.filter(item => {
            return item.Util_factor >= lowerLimit && item.Util_factor <= higherLimit
        })
        .map(i => {
            let currentTruck = truckNo+=1
            return{
                ...i,
                truck_type:'6W',
                truck_no:currentTruck,
                drop:1
            }
        })
    }
    else{

        return unUtilizedTrips.filter(item => {
            return  (item.Util_factor >= lowerLimit && item.Util_factor <= higherLimit)
            &&      (item.is_Drop1)
        })
        .map(i => {
            let currentTruck = truckNo+=1
            return{
                ...i,
                truck_type:'6W',
                truck_no:currentTruck,
                drop:1
            }
        })

    }

}

const unUtilized = ({
    bookings,
    utilized
}) => {
    return bookings.filter(item => {
            return !utilized.map(item => item.id).includes(item.id)
    })
}

const coload_4WL300 = async({
    trip,
    unPlanned,
    drops
}) => {
    try {

        let utilized = trip;
        const bookings = unPlanned;

        let L3004WPlannedDrops = trip.filter(item => {
            // return ['4W', 'L300'].includes(item.truck_type)
            return ['4W/L300'].includes(item.truck_type)
        })

        let L3004WPlanned_thatNeedsCoload = _.groupBy(L3004WPlannedDrops, 'truck_no')
        let ArrayOfDrops = Array.from({length: drops}, (_, i) => i + 1);

        Object.keys(L3004WPlanned_thatNeedsCoload).map(async(truckNo) => {

            let truckPlanNo = L3004WPlanned_thatNeedsCoload[truckNo]; //array of booking objects

            for(let dropNo = truckPlanNo.length; dropNo < drops; dropNo++) {
                let updatedTruckNo = utilized.filter(tr => tr.truck_no == truckNo)
                let existingDrops = [...new Set(updatedTruckNo.map(e => e.drop))]; //[1,2,3]

                let sumUtilTruckNo = _.sumBy(updatedTruckNo, 'Util_factor');
                // let neededUtil = updatedTruckNo[0].truck_type == '4W' ? (47.8873239-sumUtilTruckNo) : (28.1690141-sumUtilTruckNo);
                let neededUtil = 47.8873239-sumUtilTruckNo;

                let foundCluster_Util = unPlanned.filter(booking => { return booking.Util_factor <= neededUtil 
                                                                        && booking.cluster_code === updatedTruckNo[0].cluster_code
                                                                        && !booking.is_Drop1})
                                                .filter(x => {
                                                    return !(utilized.map(y=>y.id).includes(x.id))
                                                })

                let currentDrop = (ArrayOfDrops.filter(val => !existingDrops.includes(val)))[0];

                if(foundCluster_Util.length > 0) {
                    let highest_Cluster = _.maxBy(foundCluster_Util,'Util_factor')
                    utilized.push({
                        ...highest_Cluster,
                        truck_type:truckPlanNo[0].truck_type,
                        truck_no:truckPlanNo[0].truck_no,
                        drop:currentDrop
                    })
                }
                else {
                    let foundCity_Util = unPlanned.filter(booking => { return booking.Util_factor <= neededUtil
                                                                            && booking.city === updatedTruckNo[0].city
                                                                            && !booking.is_Drop1})
                                                    .filter(x => {
                                                        return !(utilized.map(y=>y.id).includes(x.id))
                                                    })
                    if(foundCity_Util.length > 0) {
                        let highest_City = _.maxBy(foundCity_Util,'Util_factor')

                        utilized.push({
                            ...highest_City,
                            truck_type:truckPlanNo[0].truck_type,
                            truck_no:truckPlanNo[0].truck_no,
                            drop:currentDrop
                        })
                    }
                }
            }
        })

        utilized.map(a => {
            (tagTruckTypeFor4W_L300_Auv_Sedan(utilized))
            .map(b => {
                if(a.truck_no === b.truckNo){
                    a.truck_type = b.truckType
                }
            })
        })

        return{
            newTrip: _.orderBy(utilized,'truck_no','asc'),
            newUnplanned: unUtilized({
                bookings,
                utilized:utilized
            })
        }
    }
    catch(e){
        console.log(e)
    }
}

const batch0Coload = async({
    bookings
}) => {
    const batch0_firstDrop = bookings.filter(x => {
        return x.Util_factor > 100
    })

    const coload = batch0_firstDrop.map(i => {
        const util = i.Util_factor % 100
        const stc = `${i.ship_to_code}-1`
        return {
            ...i,
            ship_to_code:stc,
            Util_factor:util
        }
    })

    return coload
}

const batch0_firstDrop = async ({
    bookings,
    utilized
}) => {

    let truckNo = typeof _.maxBy(utilized,'truck_no') === 'undefined' ? 0 : (_.maxBy(utilized,'truck_no')).truck_no
    let data = []
    const batch0_firstDrop = bookings.filter(x => {
        return x.Util_factor > 100
    })
    .map(x => {
        const utilCount = Math.floor(x.Util_factor/100)

        for(let i = 1; i <= utilCount; i++){ 
            let currentTruck = truckNo+=1
            data.push({
                ...x,
                ship_to_code    :`${x.ship_to_code}-${i+1}`,
                Util_factor     : 100,
                truck_type      :'6W',
                truck_no        : currentTruck,
                drop            : 1,
            })
        }
    })

    return data
}   


const tagTruckTypeFor4W_L300_Auv_Sedan = (plannedDrops) => {
    let groupbyTruckNo = _.groupBy(plannedDrops,'truck_no')
    let test = [];
    
    Object.keys(groupbyTruckNo).map(truckNo => {
        const data = groupbyTruckNo[truckNo]
        const sumUtilFactor = _.sumBy(data,'Util_factor')
        let truckType;

        if (sumUtilFactor <= 5.21126760563380) {
            truckType = 'Sedan'
        }
        else if (sumUtilFactor <= 9.85915492957746) {
            truckType = 'Auv'
        }
        else if(sumUtilFactor <= 28.1690141) {
            truckType = 'L300'
        }
        else if(sumUtilFactor <= 47.8873239) {
            truckType = '4W'
        }


        if(typeof truckType !== 'undefined'){
            test.push({
                truckNo:parseInt(truckNo),
                sumUtilFactor,
                truckType
            })
        }
    })

    return test
}

const batch6_truck_planning = async({
    newTrip,
    newUnplanned,
    auvMaxDrops
}) => {
    try {
        //## Temporary storage of Utilized for prospect AUV/Sedan
        let utilized_AuvSedan = [];

        //## Get the latest truck no from utilized
        let truckNo = typeof _.maxBy(newTrip,'truck_no') === 'undefined' ? 0 : (_.maxBy(newTrip,'truck_no')).truck_no

        //## Get Unplanned STCs that can fit in AUV/Sedan
        let UnplannedFittedInsideAUV = _.orderBy(newUnplanned.filter(a => a.Util_factor <= 9.85915492957746), 'Util_factor', 'desc')

        do {
            //## Increment the truck No base on the latest, which will be the truck_no being proces
            truckNo++

            if(UnplannedFittedInsideAUV.length > 0) {

                //## Get the latest Util based on the Unplanned STCs
                // let highest_Util = _.maxBy(UnplannedFittedInsideAUV,'Util_factor')

                //## Get the SM first from UnplannedFittedInsideAUV
                let sm_Drop = _.find(UnplannedFittedInsideAUV, function (x) { return x.is_Drop1 })

                //## Get the latest Util based on the Unplanned STCs
                let highest_Util = typeof(sm_Drop) === 'undefined' ? _.maxBy(UnplannedFittedInsideAUV,'Util_factor') : sm_Drop;

                //## Push the highest Util, then tag as { drop:1, truck_type:Auv/Sedan }
                utilized_AuvSedan.push({
                    ...highest_Util,
                    truck_type:'Auv/Sedan',
                    truck_no:truckNo,
                    drop:1
                })

                //## Update the list of unplanned STCs by removing the Utilized data
                UnplannedFittedInsideAUV = UnplannedFittedInsideAUV.filter(item => {
                    return !utilized_AuvSedan.map(item => item.id).includes(item.id)
                })

                //## Compute the total Util of the current truck_no
                let sumUtilTruckNo = _.sumBy((utilized_AuvSedan.filter(a => a.truck_no == truckNo )), 'Util_factor');

                for(let dropNo = 2; dropNo <= auvMaxDrops && sumUtilTruckNo < 9.85915492957746; dropNo++) {
                    //## Compute the total Util of the current truck_no
                    sumUtilTruckNo = _.sumBy((utilized_AuvSedan.filter(a => a.truck_no == truckNo )), 'Util_factor');

                    //## Compute the needed Util based on the sum Util
                    let neededUtil = 9.85915492957746-sumUtilTruckNo;

                    //## filter the list of UnplannedFittedInsideAUV for the next drop base on the condition, "CLUSTER"
                    let foundCluster_Util = UnplannedFittedInsideAUV.filter(booking => { return booking.Util_factor <= neededUtil 
                                                                                && booking.cluster_code === highest_Util.cluster_code
                                                                                && !booking.is_Drop1})

                    if(foundCluster_Util.length > 0) {
                        //## Get the max Util from the list of UnplannedFittedInsideAUV, "CLUSTER"
                        let highest_Cluster = _.maxBy(foundCluster_Util,'Util_factor')

                        //## Push the highest Util, then tag as { drop:base on the loop, truck_type:Auv/Sedan }
                        utilized_AuvSedan.push({
                            ...highest_Cluster,
                            truck_type:'Auv/Sedan',
                            truck_no:truckNo,
                            drop:dropNo
                        })

                        //## Update the list of unplanned STCs by removing the Utilized data
                        UnplannedFittedInsideAUV = UnplannedFittedInsideAUV.filter(item => {
                            return !utilized_AuvSedan.map(item => item.id).includes(item.id)
                        })
                    }
                    else {
                        //## filter the list of UnplannedFittedInsideAUV for the next drop base on the condition, "CITY"
                        let foundCity_Util = UnplannedFittedInsideAUV.filter(booking => { return booking.Util_factor <= neededUtil
                                                                                && booking.city === highest_Util.city
                                                                                && !booking.is_Drop1})

                        if(foundCity_Util.length > 0) {
                            //## Get the max Util from the list of UnplannedFittedInsideAUV, "CITY"
                            let highest_City = _.maxBy(foundCity_Util,'Util_factor')

                            //## Push the highest Util, then tag as { drop:base on the loop, truck_type:Auv/Sedan }
                            utilized_AuvSedan.push({
                                ...highest_City,
                                truck_type:'Auv/Sedan',
                                truck_no:truckNo,
                                drop:dropNo
                            })

                            //## Update the list of unplanned STCs by removing the Utilized data
                            UnplannedFittedInsideAUV = UnplannedFittedInsideAUV.filter(item => {
                                return !utilized_AuvSedan.map(item => item.id).includes(item.id)
                            }) 
                        }
                    }
                }
            }

            //## Update the list of unplanned STCs by removing the Utilized data
            UnplannedFittedInsideAUV = UnplannedFittedInsideAUV.filter(item => {
                return !utilized_AuvSedan.map(item => item.id).includes(item.id)
            })

        }
        while (UnplannedFittedInsideAUV.length > 0)

        let bookings = newUnplanned;

        //## Compute and tag the vehicle type
        utilized_AuvSedan.map(a => {
            (tagTruckTypeFor4W_L300_Auv_Sedan(utilized_AuvSedan))
            .map(b => {
                if(a.truck_no === b.truckNo){
                    a.truck_type = b.truckType
                }
            })
        })

        return {
            newerTrip : [].concat(newTrip, utilized_AuvSedan),
            newerUnplanned : unUtilized({
                bookings,
                utilized:utilized_AuvSedan
            })
        }

    }
    catch(e){
        console.log(e)
    }
}

const breakdownBookings = async({
    bookings,
    upper_limit
}) => {
    try{
        let binukadkad = bookings.reduce((total, item) => {
            if(item.Util_factor > 100) {
                let countTruck = Math.ceil(item.Util_factor/upper_limit);
                let totalUtil_factor = item.Util_factor;
                
                let truckNo = 1;
                
                while(truckNo <= countTruck) {
                    total.push({...item,
                            "id":`${item.id}-${truckNo}`,
                            "ship_to_code": `${item.ship_to_code}-${truckNo}`,
                            "Util_factor": (totalUtil_factor >= upper_limit ? upper_limit : totalUtil_factor % upper_limit)
                    });
                    totalUtil_factor-=upper_limit
                    truckNo++;
                }
            }
            else{
                total.push({...item})
            }
            return total
        }, [])

        return binukadkad

    }catch(e){
        console.log(e)
    }
}

const sixWheel_truck_planning = async({
    bookingss,
    drops,
    lowerLimit,
    higherLimit
}) => {
    try {
        //## Temporary storage of Utilized for 6W
        let utilized = [];

        //## assign the 1st truck No
        let truckNo = 0;
        //## Get Unplanned STCs that can fit in 6w
        let UnplannedBookings = _.orderBy(bookingss.filter(a => a.Util_factor > lowerLimit), 'Util_factor', 'desc')

        do {
            //## Increment the truck No base on the latest, which will be the truck_no being proces
            truckNo++

            if(UnplannedBookings.length > 0) {

                //## Get the SM first from UnplannedBookings
                let sm_Drop = _.find(UnplannedBookings, function (x) { return x.is_Drop1 })

                //## Get the latest Util based on the Unplanned STCs
                let highest_Util = typeof(sm_Drop) === 'undefined' ? _.maxBy(UnplannedBookings,'Util_factor') : sm_Drop;

                //## Push the highest Util
                utilized.push({
                    ...highest_Util,
                    truck_type:'6W',
                    truck_no:truckNo,
                    drop:1
                })

                //## Update the list of unplanned STCs by removing the Utilized data
                UnplannedBookings = UnplannedBookings.filter(item => {
                    return !utilized.map(item => item.id).includes(item.id)
                })

                //## Compute the total Util of the current truck_no
                let sumUtilTruckNo = _.sumBy((utilized.filter(a => a.truck_no == truckNo )), 'Util_factor');

                for(let dropNo = 2; dropNo <= drops && sumUtilTruckNo < 100; dropNo++) {
                    
                    //## Compute the total Util of the current truck_no
                    sumUtilTruckNo = _.sumBy((utilized.filter(a => a.truck_no == truckNo )), 'Util_factor');

                    //## Compute the needed Util based on the sum Util
                    let neededUtil = 100-sumUtilTruckNo;

                    //## filter the list of UnplannedBookings for the next drop base on the condition, "CLUSTER"
                    let foundCluster_Util = UnplannedBookings.filter(booking => { return booking.Util_factor <= neededUtil 
                                                                                && booking.cluster_code === highest_Util.cluster_code
                                                                                && !booking.is_Drop1})

                    if(foundCluster_Util.length > 0) {
                        //## Get the max Util from the list of UnplannedBookings, "CLUSTER"
                        let highest_Cluster = _.maxBy(foundCluster_Util,'Util_factor')

                        //## Push the highest Util, then tag as { drop:base on the loop, truck_type:Auv/Sedan }
                        utilized.push({
                            ...highest_Cluster,
                            truck_type:'6W',
                            truck_no:truckNo,
                            drop:dropNo
                        })

                        //## Update the list of unplanned STCs by removing the Utilized data
                        UnplannedBookings = UnplannedBookings.filter(item => {
                            return !utilized.map(item => item.id).includes(item.id)
                        })
                    }
                    else {
                        //## filter the list of UnplannedBookings for the next drop base on the condition, "CITY"
                        let foundCity_Util = UnplannedBookings.filter(booking => { return booking.Util_factor <= neededUtil
                                                                                && booking.city === highest_Util.city
                                                                                && !booking.is_Drop1})

                        if(foundCity_Util.length > 0) {
                            //## Get the max Util from the list of UnplannedBookings, "CITY"
                            let highest_City = _.maxBy(foundCity_Util,'Util_factor')

                            //## Push the highest Util, then tag as { drop:base on the loop, truck_type:Auv/Sedan }
                            utilized.push({
                                ...highest_City,
                                truck_type:'6W',
                                truck_no:truckNo,
                                drop:dropNo
                            })

                            //## Update the list of unplanned STCs by removing the Utilized data
                            UnplannedBookings = UnplannedBookings.filter(item => {
                                return !utilized.map(item => item.id).includes(item.id)
                            }) 
                        }
                    }
                }
            }

            //## Update the list of unplanned STCs by removing the Utilized data
            UnplannedBookings = UnplannedBookings.filter(item => {
                return !utilized.map(item => item.id).includes(item.id)
            })

        }
        while (UnplannedBookings.length > 0)

        return utilized

    }
    catch(e){
        console.log(e)
    }
}


exports.newUtilization = async({
    bookings,
    config
}) => {
    let utilized = [];

    const batch1 = await retrieveFirstDrop({
        higherLimit: config.batch1_upper_limit,
        lowerLimit: config.batch1_lower_limit,
        bookings,
        utilized:utilized,
        isSM: false
    })

    batch1.map(x => {
        utilized.push({
            ...x
        })
    })

    coloadCluster({
        utilized:utilized,
        unUtilized:unUtilized({
            bookings,
            utilized:utilized
        }),
        drops:5
    })

    return {
        trip:utilized,
        unPlanned:unUtilized({
            bookings,
            utilized:utilized
        })
    }
}

const coloadCluster = ({
    utilized,
    unUtilized,
    drops
}) => {

    const groupByTruck = _.groupBy(utilized,'truck_no')
    Object.keys(groupByTruck).map(truck => {
        const data = groupByTruck[truck]
        if(data.length < drops){

            console.log(data)
            //retrieve sum of util factor
            

        }
        
    })

    //console.log(groupByTruck)

}