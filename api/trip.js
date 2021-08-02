const alexysService = require('../services/alexys/alexysServices');
const sftpService = require('../services/sftp/sftpServices');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const json2csv = require('json2csv').parse;

router.get('/', async(req, res) => {
    try{

        let { Filename_inp, PreGeneratedPlanId_inp, paramdate1_inp, paramDate2_inp } = req.query;

        const ngayon = moment().format('YYYY-MM-DD');

        // Filename_inp =  typeof(Filename_inp) === 'undefined' || Filename_inp == '' ? '' : Filename_inp;
        PreGeneratedPlanId_inp = typeof(PreGeneratedPlanId_inp) === 'undefined' || PreGeneratedPlanId_inp == '' ? '' : PreGeneratedPlanId_inp;
        paramdate1_inp = typeof(paramdate1_inp) === 'undefined' ? ngayon : paramdate1_inp;
        // paramDate2_inp = typeof(paramDate2_inp) === 'undefined' || paramDate2_inp == '' ? ngayon : paramDate2_inp;

        // const filter = { 
        //                 'filename' : Filename_inp,
        //                 'order' : PreGeneratedPlanId_inp,
        //                 'createdFrom' : paramdate1_inp+' 00:00:01',
        //                 'createdTo' : paramDate2_inp+' 23:59:59'
        // }

        const bookings = null ; //await bookingService.getBookings(filter)
        // console.log(bookings, 'bookings')

        res.render('../views/trip/index', {bookings, PreGeneratedPlanId_inp, paramdate1_inp})
    }
    catch(e){
        console.log(e)
        // res.status(500).json({message:e});
        res.send(req.flash(`error_msg','ERROR : ${e}`));
        res.redirect('/');
    }
})

router.get('/table to csv', async(req, res) => {

    let loadSheet_inp = req.query.loadSheet_inp;

    if(typeof loadSheet_inp == 'undefined') {
        res.render('../views/alexys/index_GI',{
            loadSheet_inp
        })
    }
    else if(loadSheet_inp == '') {
        // res.render("../views/alexys/index_GI", {error_msg: 'ERROR : No loadsheet provided'});

        res.send(req.flash('error_msg', 'Error : Please provide a Loadsheet number.'));
        res.redirect('/alexys');
    }
    else {
        let loadSheet_inp = req.query.loadSheet_inp;

        console.log(`Manual Generate SO files refDoc:${loadSheet_inp} `);

        await alexysService.getLoadedDataByLoadSheet(loadSheet_inp).then(async(LoadedData) =>{

            // console.log(LoadedData, 'LoadedData')

            let NormalizedLoadedData = LoadedData.map(item => {
                return {
                    'provider awb'                      : item['ODONum'],
                    'account code'                      : '2020100000000003',
                    'order number'                      : item['Name'],
                    'shipper'                           : 'Glovis',
                    'shipper address'                   : 'Pasig',
                    'shipper email'                     : '',
                    'shipper barangay code'             : '',
                    'pick up phone'                     : '',
                    'paymode'                           : '',
                    'product'                           : '',
                    'vas'                               : '',
                    'remarks'                           : '',
                    'shipper special instruction'       : '',
                    'consignee name'                    : item['Shipping_Name'],
                    'consignee email'                   : item['Email'],
                    'phone number'                      : item['Shipping_Phone'],
                    'landline number'                   : '',
                    'address type'                      : '',
                    'consignee address'                 : item['Shipping_Address1'],
                    'consignee barangay code'           : '',
                    'consignee special instruction'     : '',
                    'package size'                      : '',
                    'length'                            : '',
                    'width'                             : '',
                    'height'                            : '',
                    'weight'                            : '',
                    'quantity'                          : '', //item['pickQty'], //#to be provided by the cx
                    'payment type'                      : item['Payment_Method'],
                    'cod amount'                        : item['Total'],
                    'commodity'                         : 'Assorted',
                    'package'                           : '',
                    'ispullout'                         : '',
                    'declared value'                    : '',
                    'consignee landmark'                : '',
                    'booking date'                      : '',
                    'item code'                         : '' //item['itemCode'],
                    }
                }
            );

            let headers = [];
            for(let k in NormalizedLoadedData[0]) { //## declare headers[] for csv reference
                headers.push(k);
            }

            let giExecDate = `${LoadedData[0]['loadedDate'].replace(/\-/g,'').replace(/\:/g,'').replace(' ','_').replace('T','_')}`;
            let giExecDateFormatter = giExecDate.slice(0,-2).slice(2, 13);

            let filePath = path.join(__dirname,'../resources/GeneratedAlexysCSV/'+`${LoadedData[0]['loadSheet']}_${giExecDateFormatter}.csv`)

            try{
                fs.writeFileSync(filePath, json2csv(NormalizedLoadedData, {fields : headers})) //## Generate the csv fil
            } catch(err) {
                log.logThis(err);
            } finally{
                let csvString = fs.readFileSync(filePath).toString();
                // var result = csvString.replace(/"/g, '');
                // fs.writeFileSync(filePath, result)
                fs.writeFileSync(filePath, csvString)
            }
            return filePath;
        }).then(async(localfilePath) => {
                let remoteFilePath = '/D:/logsftp/Glovis/ALEXYS/';
                let filename = localfilePath.split('\\')[localfilePath.split('\\').length-1];
                let istransferred = await sftpService.insertFileToSFTP(localfilePath, `${remoteFilePath}${filename}`);
                return  {filename : filename, 
                        istransferred : istransferred
                };
        }).then((value) => {
            if(value.istransferred) {
                res.render('../views/alexys/index_GI',{
                    loadSheet_inp, success_msg: `Successfully generated and transferred ${value.filename}`
                })
            }
        }).catch(error => { 
            res.render("../views/alexys/index_GI", {error_msg: `ERROR : ${error.message} `});
            console.log(error) });
    }
})

module.exports = router;