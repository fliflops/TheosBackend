const dataLayer = require('./bookingDataLayer');
const sftpService = require('../sftp');
const csv = require('csvtojson/v2');
const moment = require('moment');

exports.getBookings = async(filter) => {
    try{
        const { invoice, rdd} = filter;

        const bookings = await dataLayer.getBookings(filter)

        return bookings
    }
    catch(e) {
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.getBookingsPerStc = async ({
    deliveryDate
}) => {
    try{
        const bookings = await dataLayer.getBookingsPerStc({
            deliveryDate
        })

        return bookings.sort((a,b) => {
            return b.Util_factor - a.Util_factor
        })

    }
    catch(e){
        console.log(e)
        throw new Error(`${e}`)
    }
}

exports.groupBookingsRDD = async ({
    from,
    to
}) => {
    try{
        let data = [];
        for(let rdd = moment(from); rdd <= moment(to); rdd.add(1,'days')){
            const bookings = await dataLayer.getBookingsPerStc({
                deliveryDate:rdd.format('YYYY-MM-DD')
            })
            
            data.push({
                deliveryDate:rdd.format('YYYY-MM-DD'),
                bookings:bookings
            })
           
        }   
    
    
        return {
            groupedData:data
        }
    }
    catch(e){
        console.log(e)
    }   
}

exports.groupBookingsRDD = async({
    data
}) => {
    try{

        const groupData = _.groupBy(data)

    }
    catch(e){

        throw e
    }
}