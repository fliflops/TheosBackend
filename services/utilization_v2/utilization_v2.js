const _ = require('lodash');
const {getDistance} = require ('geolib');

exports.utilization = async ({
    bookings,
    drops,
    fourWheelDrops,
    l300Drops,
    auvDrops,     
    sedandrops,    
    radius,
    upperLimit,
    lowerLimit
}) => {

    const batch0Bookings = await breakdownBookings({
        bookings,
        upper_limit: upperLimit
    })

    const {newerTrip} = await sixWheelUtilization({
        bookings: batch0Bookings,
        drops,
        radius,
        smDrops:2
    })

    //assign 4W/L300 to trips with less than 40% utilization
    const utilizedWith4W = await fourWheelUtilization({
        bookings:newerTrip,
        drops:fourWheelDrops,
        radius,
        availableBookings:batch0Bookings.filter(item => {
            return !newerTrip.map(x => x.id).includes(item.id)
            &&      (item.long !== null || item.lat !== null) 
        })
    })

    const utiliziedWithL300 = await L300Utilization({
        bookings:utilizedWith4W,
        drops: l300Drops,
        radius,
        availableBookings: batch0Bookings.filter(item => {
            return !utilizedWith4W.map(x => x.id).includes(item.id)
            &&      (item.long !== null || item.lat !== null) 
        }),
        capacity:28.1690141,
        truckType: 'L300'
    })

    const utilizedWithAuv = await L300Utilization({
        bookings:utiliziedWithL300,
        drops:auvDrops,
        radius,
        availableBookings: batch0Bookings.filter(item => {
            return !utiliziedWithL300.map(x => x.id).includes(item.id)
            &&      (item.long !== null || item.lat !== null) 
        }),
        capacity:9.85915492957746,
        truckType: 'Auv'
    })

    const utilizedWithSedan = await L300Utilization({
        bookings:utilizedWithAuv,
        drops:sedandrops,
        radius,
        availableBookings: batch0Bookings.filter(item => {
            return !utilizedWithAuv.map(x => x.id).includes(item.id)
            &&      (item.long !== null || item.lat !== null) 
        }),
        capacity:5.21126760563380,
        truckType: 'Sedan'
    })


    // _.sortBy(await tagTruckTypeFor4W_L300_Auv_Sedan(newerTrip),['truck_no','drop'])

    return{
       utilized: //_.sortBy(test,['truck_no','drop']),
       _.sortBy(await tagTruckTypeFor4W_L300_Auv_Sedan(utilizedWithSedan),['truck_no','drop']),
       notAllocated: bookings.filter(item => {
           return !utilizedWithSedan.map(i => i.ship_to_code).includes(item.ship_to_code)
       })
    }
    
}

const tagTruckTypeFor4W_L300_Auv_Sedan = (plannedDrops) => {
    let groupbyTruckNo = _.groupBy(plannedDrops,'truck_no')
    let truckTypes = [];
    
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
            truckTypes.push({
                truckNo:parseInt(truckNo),
                sumUtilFactor,
                truckType
            })
        }
    })


    return plannedDrops.map(item => {
        const truckType = truckTypes.filter(x => x.truckNo === item.truck_no)

        if(truckType.length > 0){
            item.truck_type = truckType[0].truckType
        }

        return item
    })

    // return test
}

const L300Utilization = async({
    bookings,
    drops,
    radius,
    capacity,
    truckType
}) => {
    
    let utilized = [];
    let tripsWithL300 = [];

    let trucks = _.groupBy(bookings,'truck_no');

    //Re-assign Trip
    Object.keys(trucks).map(truckNo => {
        const data = trucks[truckNo];
        const sumUtilFactor = _.sumBy(data,'Util_factor')

        if(sumUtilFactor <= capacity && data.length < drops){
            tripsWithL300.push({
                truck_no:parseInt(truckNo),
                sumUtilFactor,
                truck_type:truckType
            })
        }
    })

    let availableBookings = _.sortBy(bookings.filter(item => {
        return tripsWithL300.map(x => x.truck_no).includes(item.truck_no)
    }),'Util_factor','desc')

    let tempUtilized = bookings.filter(item => {
        return !tripsWithL300.map(x => x.truck_no).includes(item.truck_no)
    })

    trucks = _.groupBy(tempUtilized,'truck_no');

    let newTruckNo = 0;
    Object.keys(trucks).map(truckNo => {
        newTruckNo++;
        const data = trucks[truckNo]

        data.map(item => {
            utilized.push({
                ...item,
                truck_no:newTruckNo
            })
        })

    })

    let truckNo = typeof _.maxBy(utilized,'truck_no') === 'undefined' ? 0 : (_.maxBy(utilized,'truck_no')).truck_no
    if(availableBookings.length > 0){
        do{
            truckNo++;
            let highest_Util = _.maxBy(availableBookings,'Util_factor');

            utilized.push({
                ...highest_Util,
                truck_type:truckType,
                truck_no:truckNo,
                distance:0,
                drop:1
            })

            //## Update the list of unplanned STCs by removing the Utilized data
            availableBookings = availableBookings.filter(item => {
                return !utilized.map(item => item.id).includes(item.id)
            })
            .map(x => {
                const distance = (getDistance(
                    {
                        longitude:highest_Util.long,
                        latitude:highest_Util.lat
                    },
                    {
                        longitude:x.long,
                        latitude:x.lat
                    }
                )) / 1000

                return{
                    ...x,
                    distance
                }

            })

            let sumUtilTruckNo = _.sumBy((utilized.filter(a => a.truck_no == truckNo )), 'Util_factor');

            for(let dropNo = 2; dropNo <= drops && sumUtilTruckNo < capacity; dropNo++ ){
                if(dropNo === 2){
                    sumUtilTruckNo = _.sumBy((availableBookings.filter(a => a.truck_no == truckNo )), 'Util_factor');

                    //## Compute the needed Util based on the sum Util
                    let neededUtil = capacity-sumUtilTruckNo;

                    let foundCluster_Util = availableBookings.filter(booking => { 
                        return  booking.Util_factor <= neededUtil 
                        &&      booking.distance <= radius
                        // && !booking.is_Drop1
                    })

                    if(foundCluster_Util.length > 0){
                        //## Get the max Util from the list of UnplannedFittedInsideAUV, "CLUSTER"
                        let highest_Cluster = _.maxBy(foundCluster_Util,'Util_factor')

                        //## Push the highest Util, then tag as { drop:base on the loop, truck_type:Auv/Sedan }
                        utilized.push({
                            ...highest_Cluster,
                            truck_type:truckType,
                            truck_no:truckNo,
                            drop:dropNo
                        })

                        //## Update the list of unplanned STCs by removing the Utilized data
                        availableBookings = availableBookings.filter(item => {
                            return !utilized.map(item => item.id).includes(item.id)
                        })
                    }

                }
                else{
                    sumUtilTruckNo = _.sumBy((utilized.filter(a => a.truck_no == truckNo )), 'Util_factor');

                        let lastDrop = _.find(utilized,(i) => {
                            return i.truck_no === truckNo && i.drop === dropNo - 1
                        })

                        if(typeof lastDrop !== 'undefined'){

                            availableBookings =  availableBookings.map(item => {
                                const distance = (getDistance(
                                {latitude:lastDrop.lat,     longitude:lastDrop.long},
                                {latitude:item.lat,         longitude:item.long})) / 1000
                                
                                return{
                                    ...item,
                                    distance
                                }
                            })
                        
                             //## Compute the needed Util based on the sum Util
                            let neededUtil = capacity-sumUtilTruckNo;

                            let foundCluster_Util = availableBookings.filter(booking => { return booking.Util_factor <= neededUtil 
                                && booking.distance <= radius
                                && !booking.is_Drop1
                            })

                            if(foundCluster_Util.length > 0){
                                //## Get the max Util from the list of UnplannedFittedInsideAUV, "CLUSTER"
                                let highest_Cluster = _.maxBy(foundCluster_Util,'Util_factor')

                                //## Push the highest Util, then tag as { drop:base on the loop, truck_type:Auv/Sedan }
                                utilized.push({
                                    ...highest_Cluster,
                                    truck_type:truckType,
                                    truck_no:truckNo,
                                    drop:dropNo
                                })

                                //## Update the list of unplanned STCs by removing the Utilized data
                                availableBookings = availableBookings.filter(item => {
                                    return !utilized.map(item => item.id).includes(item.id)
                                })
                            }
                        }
                }
            }

        }
        while(availableBookings.length > 0)
    }
    return utilized
}

const fourWheelUtilization = async({
    bookings,
    drops,
    radius,
    availableBookings
}) => {

    let utilized = [];
    let tripsWithFourWheels = [];

    let trucks = _.groupBy(bookings,'truck_no');

    Object.keys(trucks).map(truckNo => {
        const data = trucks[truckNo];
        const sumUtilFactor = _.sumBy(data,'Util_factor')

        if(sumUtilFactor <= 47.8873239 && data.length < drops){
            tripsWithFourWheels.push({
                truck_no:parseInt(truckNo),
                sumUtilFactor,
                truck_type:'4W/L300'
            })
        }
    })

    utilized = bookings.map(item => {
        if(tripsWithFourWheels.map(y => y.truck_no).includes(item.truck_no)){
            item.truck_type = '4W/L300'
        }

        return item
    })          

    let unPlanned = availableBookings

    const utilized4w = utilized.filter(item => item.truck_type === '4W/L300')
    
    const utilized4wGroupByTruckNo = _.groupBy(utilized4w,'truck_no')
    Object.keys(utilized4wGroupByTruckNo).map(truckNo => {
        const data = utilized4wGroupByTruckNo[truckNo]

        //Retrieve Trip with Highest Drop Count
        const latestDrop = _.maxBy(data,'drop')

        if(latestDrop.drop === 1){

            unPlanned = unPlanned.map(item => {
                const distance = getDistance({
                    longitude:latestDrop.long,
                    latitude:latestDrop.lat
                },
                {
                    longitude:item.long,
                    latitude:item.lat
                })
    
                return{
                    ...item,
                    distance
                }
            })

            let updatedTruckNo = utilized.filter(tr => tr.truck_no === parseInt(truckNo))
            let sumUtilTruckNo = _.sumBy(updatedTruckNo, 'Util_factor');
            let neededUtil = 47.8873239-sumUtilTruckNo;

            let foundCluster_Util = unPlanned.filter(x => {
                return x.Util_factor <= neededUtil
                &&  x.distance <= radius
                // && !x.is_Drop1
            })

            if(foundCluster_Util.length > 0){
                let highest_Cluster = _.maxBy(foundCluster_Util,'Util_factor')
               
                utilized.push({
                    ...highest_Cluster,
                    truck_type:latestDrop.truck_type,
                    truck_no:latestDrop.truck_no,
                    drop:2
                })

                ununPlanned = unPlanned.filter(x => !utilized.map(y => y.id).includes(x.id))
            }

        }
        else if(latestDrop.drop > 1){
            let updatedTruckNo = utilized.filter(tr => tr.truck_no === parseInt(truckNo))
            let sumUtilTruckNo = _.sumBy(updatedTruckNo, 'Util_factor');
            let neededUtil = 47.8873239-sumUtilTruckNo;

            for(let dropNo = latestDrop.drop; dropNo <= drops; dropNo++){

                unPlanned = unPlanned.map(item => {
                    const distance = getDistance({
                        longitude:(updatedTruckNo.filter(x => x.drop === dropNo-1))[0].long,
                        latitude:(updatedTruckNo.filter(x => x.drop === dropNo-1))[0].lat
                    },
                    {
                        longitude:item.long,
                        latitude:item.lat
                    })
        
                    return{
                        ...item,
                        distance
                    }
                })

                let foundCluster_Util = unPlanned.filter(x => {
                    return x.Util_factor <= neededUtil
                    &&  x.distance <= radius
                    && !x.is_Drop1
                })

                if(foundCluster_Util.length > 0){
                    let highest_Cluster = _.maxBy(foundCluster_Util,'Util_factor')
                   
                    utilized.push({
                        ...highest_Cluster,
                        truck_type:latestDrop.truck_type,
                        truck_no:latestDrop.truck_no,
                        drop:dropNo
                    })
    
                    ununPlanned = unPlanned.filter(x => !utilized.map(y => y.id).includes(x.id))
                }                
            }   

        }
    })

    return utilized
}

const sixWheelUtilization = async({
    bookings,
    drops,
    radius
}) => {
    try{
        
        let utilized = [];
        let truckNo = 0;

        let availableBookings = _.orderBy(bookings.filter(x => x.Util_factor <= 100 && (x.long !== null ||x.lat !== null)),'Util_factor','desc');
    
        if(availableBookings.length > 0){
            do{
                truckNo++;

                const isDrop1 = _.find(availableBookings,(i) => i.is_Drop1)

                const firstDrop = typeof isDrop1  === 'undefined' ? _.maxBy(availableBookings,'Util_factor') : isDrop1

                utilized.push({
                    ...firstDrop,
                    truck_type:'6W',
                    truck_no:truckNo,
                    distance:0,
                    drop:1   
                })

                availableBookings = availableBookings
                .filter(i => !utilized.map(x => x.id).includes(i.id))
                .map(item => {
                    const distance = (getDistance(
                    {latitude:firstDrop.lat,         longitude:firstDrop.long},
                    {latitude:item.lat,              longitude:item.long})) / 1000

                    return{
                        ...item,
                        distance
                    }
                })

                ////Compute Distance between first drop and available bookings
                let sumUtilTruckNo = _.sumBy((utilized.filter(a => a.truck_no == truckNo )), 'Util_factor');

                for(let dropNo = 2; dropNo <= drops && sumUtilTruckNo < 100; dropNo ++){

                    if(dropNo === 2){
                        
                        sumUtilTruckNo = _.sumBy((utilized.filter(a => a.truck_no == truckNo )), 'Util_factor');
                        
                        //## Compute the needed Util based on the sum Util
                        let neededUtil = 100-sumUtilTruckNo;

                        //## filter the list of UnplannedBookings for the next drop base on the condition, "CLUSTER"
                        let foundCluster_Util = availableBookings.filter(booking => { 
                            return booking.Util_factor <= neededUtil 
                            && booking.distance <= radius
                                //Remove SM for Drop 2
                            // && !booking.is_Drop1
                        })

                        if(foundCluster_Util.length > 0){

                            //## Get the max Util from the list of UnplannedBookings, "CLUSTER"
                            let currentDrop = _.maxBy(foundCluster_Util,'Util_factor')

                            //## Push the highest Util, then tag as { drop:base on the loop, truck_type:Auv/Sedan }
                            utilized.push({
                                ...currentDrop,
                                truck_type:'6W',
                                truck_no:truckNo,
                                drop:dropNo
                            })
                            
                            //## Update the list of unplanned STCs by removing the Utilized data
                            availableBookings = availableBookings.filter(item => {
                                return !utilized.map(item => item.id).includes(item.id)
                            })
                        }
                    }
                    else{

                        sumUtilTruckNo = _.sumBy((utilized.filter(a => a.truck_no == truckNo )), 'Util_factor');
                        
                        //## Compute the needed Util based on the sum Util
                        let neededUtil = 100-sumUtilTruckNo;

                        let lastDrop = _.find(utilized,(i) => {
                            return i.truck_no === truckNo && i.drop === dropNo - 1
                        })

                        if(typeof lastDrop !== 'undefined'){
                            availableBookings =  availableBookings.map(item => {
                                    const distance = (getDistance(
                                    {latitude:lastDrop.lat,     longitude:lastDrop.long},
                                    {latitude:item.lat,         longitude:item.long})) / 1000
                                    
                                    return{
                                        ...item,
                                        distance
                                    }
                                })
                            }

                            let foundCluster_Util = availableBookings.filter(booking => { return booking.Util_factor <= neededUtil 
                                && booking.distance <= radius
                                && !booking.is_Drop1
                            })

                            if(foundCluster_Util.length > 0){

                            //## Get the max Util from the list of UnplannedBookings, "CLUSTER"
                            let currentDrop = _.maxBy(foundCluster_Util,'Util_factor')

                            //## Push the highest Util, then tag as { drop:base on the loop, truck_type:Auv/Sedan }
                            utilized.push({
                                ...currentDrop,
                                truck_type:'6W',
                                truck_no:truckNo,
                                drop:dropNo
                            })
                            
                            //## Update the list of unplanned STCs by removing the Utilized data
                            availableBookings = availableBookings.filter(item => {
                                return !utilized.map(item => item.id).includes(item.id)
                            })
                        }
                    }
                    
                }
            }
            while(availableBookings.length > 0)
        }

        return {
            newerTrip:utilized, 
            newerUnplanned:availableBookings
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
        //`${item.ship_to_code}${truckNo === 1 ? '':`-${truckNo}`}`
        return bookings.reduce((total, item) => {
            if(item.Util_factor > upper_limit) {
                let countTruck = Math.ceil(item.Util_factor/upper_limit);
                let totalUtil_factor = item.Util_factor;
                
                let truckNo = 1;
                
                while(truckNo <= countTruck) {
                    total.push({...item,
                            "id":`${item.id}-${truckNo}`,
                            "ship_to_code": truckNo === 1 ? item.ship_to_code : `${item.ship_to_code}-${truckNo}`,
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

    }catch(e){
        console.log(e)
    }
}

