const _ = require('lodash');
const {getDistance} = require ('geolib');
module.exports = async ({
    bookings,      
    drops,      
    fourWheelDrops,
    l300Drops,
    auvDrops,     
    sedandrops,    
    radius,        
    radius4W,      
    radiusL300,    
    radiusAuv,    
    radiusSedan,   
    smDrop,        
    smDrop4W,      
    smDropL300,    
    smDropAuv,    
    smDropSedan,
    capacity,
    capacity4W,
    capacityL300,
    capacityAuv,
    capacitySedan   
}) => {

    const batch0Bookings = await breakdownBookings({
        bookings,
        upper_limit: 100
    })   

    const utilized6W = await sixWheelUtilization({
        bookings: batch0Bookings,
        drops,
        radius
    })

    const utilized4W = await utilization({
        bookings:utilized6W,
        drops:fourWheelDrops,
        radius:radius4W,
        capacity:capacity4W,
        truckType:'4W',
        smDrops:smDrop4W

    })

    const utilizedL300 = await utilization({
        bookings:utilized4W,
        drops:l300Drops,
        radius:radiusL300,
        capacity:capacityL300,
        truckType:'L300',
        smDrops:smDropL300
    })

    const utilizedAuv = await utilization({
        bookings:utilizedL300,
        drops:auvDrops,
        radius:radiusAuv,
        capacity:capacityAuv,
        truckType:'AUV',
        smDrops:smDropAuv
    })

    const utilizedSedan= await utilization({
        bookings:utilizedAuv,
        drops:sedandrops,
        radius:radiusSedan,
        capacity:capacitySedan,
        truckType:'Sedan',
        smDrops:smDropSedan
    })

    return{
        utilized: utilizedSedan,
        notAllocated: await notUtilized({
            bookings:batch0Bookings,
            utilized:utilizedSedan
        })
    }
}

const utilization = async({
    bookings,
    drops,
    radius,
    capacity,
    truckType,
    smDrops
}) => {
    let utilized = [];

    const truckList = (await computeUtilSumPerTruck({
        bookings,
        capacity,
        truckType
    })).map(item => item.truck_no)

    let availableTrips = bookings.filter(item => {
        return truckList.includes(item.truck_no);
    }) 

    utilized = await reAssignTrucks({
        data:bookings.filter(item => {
            return !truckList.includes(item.truck_no);
        })
    })
    
    let truckNo =  typeof _.maxBy(utilized,'truck_no') === 'undefined' ? 0 : (_.maxBy(utilized,'truck_no')).truck_no

    do{
        truckNo++;
        
        const isDrop1 = _.find(availableTrips,(i) => i.is_Drop1)

        const firstDrop = typeof isDrop1  === 'undefined' ? _.maxBy(availableTrips,'Util_factor') : isDrop1
        
        utilized.push({
            ...firstDrop,
            truck_type:truckType,
            truck_no:truckNo,
            distance:0,
            drop:1   
        })

        availableTrips = availableTrips
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

        let sumUtilTruckNo = _.sumBy((utilized.filter(a => a.truck_no == truckNo )), 'Util_factor');


        for(let dropNo = 2; dropNo <= drops && sumUtilTruckNo <= capacity; dropNo++){
            if(dropNo > 2){   
                let lastDrop = _.find(utilized,(i) => {
                    return i.truck_no === truckNo && i.drop === dropNo - 1
                })

                if(typeof lastDrop !== 'undefined'){
                    availableTrips = availableTrips.map(item => {
                        const distance = (getDistance(
                            {latitude:lastDrop.lat,     longitude:lastDrop.long},
                            {latitude:item.lat,         longitude:item.long})) / 1000
                            
                            return{
                                ...item,
                                distance
                            }
                    })
                }
            }

            sumUtilTruckNo = _.sumBy((utilized.filter(a => a.truck_no == truckNo )), 'Util_factor');

            let neededUtil = capacity-sumUtilTruckNo;

            let foundCluster_Util = availableTrips.filter(booking => { 
                if(smDrops >= dropNo){

                    return booking.Util_factor <= neededUtil 
                    && booking.distance <= radius
                }
                else{

                    return booking.Util_factor <= neededUtil 
                    && booking.distance <= radius
                    && !booking.is_Drop1
                }
           
            })

            if(foundCluster_Util.length > 0){

                //## Get the max Util from the list of UnplannedBookings, "CLUSTER"
                let currentDrop = _.minBy(foundCluster_Util,'distance')
                //_.maxBy(foundCluster_Util,'Util_factor')

                //## Push the highest Util, then tag as { drop:base on the loop, truck_type:Auv/Sedan }
                utilized.push({
                    ...currentDrop,
                    truck_type:truckType,
                    truck_no:truckNo,
                    drop:dropNo
                })
                
                //## Update the list of unplanned STCs by removing the Utilized data
                availableTrips = availableTrips.filter(item => {
                    return !utilized.map(item => item.id).includes(item.id)
                })
            }
                        
        }
               
    }
    while(availableTrips.length > 0)

    return utilized
}

const reAssignTrucks = async({
    data
}) => {
    let newTruckNo = 0;
    let utilized = [];
    const trucks = _.groupBy(data,'truck_no')

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
    return utilized

}

const computeUtilSumPerTruck = async({
    bookings,
    capacity,
    truckType
}) => {
    
    let trucksList = _.groupBy(bookings,'truck_no');

    let tripsPerTruck = []
     Object.keys(trucksList).map(truckNo => {
        const data = trucksList[truckNo];
        const sumUtilFactor = _.sumBy(data,'Util_factor')

        if(sumUtilFactor <= capacity){
            tripsPerTruck.push({
                truck_no:parseInt(truckNo),
                sumUtilFactor,
                truck_type:truckType,
                drops: data.length
            })
        }
    })

    return tripsPerTruck
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

        return utilized

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

const notUtilized = async ({
    bookings,
    utilized
}) => {
    return bookings.filter(item => {
        return !utilized.map(x => x.id).includes(item.id)
    })
}