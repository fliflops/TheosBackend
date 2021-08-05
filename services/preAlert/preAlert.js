const _     =require('lodash');
const {v4} = require('uuid');
const fs            = require('fs');
const excel         = require('exceljs');
const moment        = require('moment');

exports.preAlertHeaderValidation = async(bookings) => {
    try{
        // console.log(bookings)
    }
    catch(e){
        throw e
    }
}

exports.retrieveBookingsPerStc = async ({
    bookings,
    vehicle,
    shipPoints
}) => {
    try{

        let utilized = [];
        const vehicle_6W    = vehicle.filter(item => item.vehicle_type === '6W');
  
        bookings.map(row => {
            const data = row.bookings
            const deliveryDate = moment(row.deliveryDate,'MM-DD-YYYY')
            let tempUtilized = []

            const groupBySTC = _.groupBy(data,'ship_to_code')
            Object.keys(groupBySTC).map(stc => {
                const data = groupBySTC[stc]
                const selectedShipPoint = _.find(shipPoints,row => row.ship_to_code === stc)//shipPoints.filter(x => x.ship_to_code === stc)
                const rdd       = deliveryDate.format('YYYY-MM-DD')
                const total_cbm = _.round(_.sum(data.map(x => parseFloat(x.cbm))),2)
                const total_wt  = _.round(_.sum(data.map(x => parseFloat(x.wt))),2)
            
                const cbm_util  = _.round((total_cbm/vehicle_6W[0].cbm_capacity)*100,2)
                const wt_util   = _.round((total_wt/vehicle_6W[0].wt_capacity)*100,2)
        
                tempUtilized.push({
                    id: v4(),
                    rdd,
                    ship_to_code:   stc,
                    consignee_id:   selectedShipPoint.consignee_id,
                    cluster_code:   selectedShipPoint.cluster_code,
                    city:           selectedShipPoint.city,
                    is_Drop1:       selectedShipPoint.is_Drop1,
                    total_cbm,
                    total_wt,
                    distance:       '',
                    lat:            selectedShipPoint.lat,
                    long:           selectedShipPoint.long,
                    '6W_cbm_util':  cbm_util,
                    '6W_wt_util':   wt_util,
                    cbm_util_factor:cbm_util,
                    wt_util_factor: wt_util,
                    Util_factor:    cbm_util > wt_util ? cbm_util:wt_util,
                    is_cbm:     cbm_util > wt_util ? true : false
                })

            })

            utilized.push({
                deliveryDate: deliveryDate.format('YYYY-MM-DD'),
                bookings:tempUtilized
            })

        })

        return utilized 
    }
    catch(e){
        throw e
    }
}


exports.exportUtilizedToExcel = async ({
    newerTrip,
    newerUnplanned,
    sp_report_utilization_drop_count,
    sp_report_no_of_trucks_per_truck_types
}) => {

    try{
        let trgtfile = `Matrix-test.xlsx`;
        if(fs.existsSync(`${__basedir}/resources/Matrix.xlsx`)) {
            var workbook = new excel.Workbook(); //create new spreadsheet file
            await workbook.xlsx.readFile(`${__basedir}/resources/Matrix.xlsx`) //## read the ODO Ramco template

            let lettah = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AZ']

            //### SHEET1
            if(newerTrip.length > 0) {
                let sheet1 = workbook.getWorksheet("Matrix"); //## get the first worksheet
                let rowNum_1 = 2; //## starting row of sheet1 in populating data

                // let N = await getIndex_withHighestNofProps(newerTrip)
                let headers = Object.keys(newerTrip[0]); //## get headers of 1st row data

                // console.log(headers)
                for(let i in headers) { //## insert the header names to first row
                    sheet1.getRow(1).getCell(lettah[i]).value = headers[i];
                }

                for(let item of newerTrip) {
                    for(let header_index in headers) {
                        sheet1.getRow(rowNum_1).getCell(lettah[header_index]).value = item[headers[header_index]];
                    }
                    rowNum_1++;
                }
            }

            //### SHEET2
            if(newerUnplanned.length > 0) {
                let sheet2 = workbook.getWorksheet("Not Allocated"); //## get the second worksheet
                let rowNum_2 = 2; //## starting row of sheet2 in populating data

                // let N = await getIndex_withHighestNofProps(newerUnplanned)
                let headers2 = Object.keys(newerUnplanned[0]); //## get headers

                for(let i in headers2) { //## insert the header names to first row
                    sheet2.getRow(1).getCell(lettah[i]).value = headers2[i];
                }

                for(let item of newerUnplanned) {
                    for(let header_index in headers2) {
                        sheet2.getRow(rowNum_2).getCell(lettah[header_index]).value = item[headers2[header_index]];
                    }
                    rowNum_2++;
                }
            }

             //### SHEET3
             if(sp_report_utilization_drop_count.length > 0) {
                 //Utilization and Drop Count
                let sheet2 = workbook.getWorksheet("Utilization and Drop Count"); //## get the second worksheet
                let rowNum_2 = 2; //## starting row of sheet2 in populating data

                // let N = await getIndex_withHighestNofProps(newerUnplanned)
                let headers2 = Object.keys(sp_report_utilization_drop_count[0]); //## get headers

                for(let i in headers2) { //## insert the header names to first row
                    sheet2.getRow(1).getCell(lettah[i]).value = headers2[i];
                }

                for(let item of sp_report_utilization_drop_count) {
                    for(let header_index in headers2) {
                        sheet2.getRow(rowNum_2).getCell(lettah[header_index]).value = item[headers2[header_index]];
                    }
                    rowNum_2++;
                }
            }

                //### SHEET4
                if(sp_report_no_of_trucks_per_truck_types.length > 0) {
                    //Count per Truck Type
                    let sheet2 = workbook.getWorksheet("Count per Truck Type"); //## get the second worksheet
                    let rowNum_2 = 2; //## starting row of sheet2 in populating data
    
                    // let N = await getIndex_withHighestNofProps(newerUnplanned)
                    let headers2 = Object.keys(sp_report_no_of_trucks_per_truck_types[0]); //## get headers
    
                    for(let i in headers2) { //## insert the header names to first row
                        sheet2.getRow(1).getCell(lettah[i]).value = headers2[i];
                    }
    
                    for(let item of sp_report_no_of_trucks_per_truck_types) {
                        for(let header_index in headers2) {
                            sheet2.getRow(rowNum_2).getCell(lettah[header_index]).value = item[headers2[header_index]];
                        }
                        rowNum_2++;
                    }
                }

            
            //let targetfilePath = `./resources/ConvertedPlanned/${trgtfile}`; //## Change the filename of the xlsx
            let targetfilePath = `${__basedir}/resources/ConvertedPlanned/${trgtfile}`
            await workbook.xlsx.writeFile(targetfilePath); //## write the file

            return targetfilePath
        }

    }
    catch(e){
        console.log(e)
        throw e
    }
    
}