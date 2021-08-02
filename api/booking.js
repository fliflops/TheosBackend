const bookingService = require('../services/bookings/bookingServices');
const masterService = require('../services/master/masterServices');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');
const excel = require('exceljs');
const multer = require('multer');
const path = require('path');
// const csv = require('csvtojson/v2');
const Papa = require('papaparse');
const json2csv = require('json2csv').parse;


router.get('/', async(req, res) => {
    try{

        let { Invoice_inp, rdd } = req.query;

        const ngayon = moment().format('YYYY-MM-DD');

        Invoice_inp = typeof(Invoice_inp) === 'undefined' || Invoice_inp == '' ? '' : Invoice_inp;
        rdd = typeof(rdd) === 'undefined' ? ngayon : rdd;

        const filter = { 'invoice' : Invoice_inp,
                        'rdd' : rdd+' 00:00:01'
        }

        // const bookings = await bookingService.getBookings(filter)
        const bookings = [];
        // console.log(bookings, 'bookings')

        res.render('../views/booking/index', {bookings, Invoice_inp, rdd})
    }
    catch(e){
        console.log(e)
        // res.status(500).json({message:e});
        res.send(req.flash(`error_msg','ERROR : ${e}`));
        res.redirect('/');
    }
})

router.get('/file_dtl', async(req, res) => {
    try{

        let { Filename_inp } = req.query;

        Filename_inp =  typeof(Filename_inp) === 'undefined' || Filename_inp == '' ? '' : Filename_inp;

        const filter = { 'filename' : Filename_inp }

        const bookings = await bookingService.getBookingsByFilename(filter)

        res.render('../views/bookings/file_dtl', {bookings, Filename_inp})
    }
    catch(e){
        console.log(e)
        res.send(req.flash(`error_msg','ERROR : ${e}`));
        res.redirect('/');
    }
})

router.get('/basicplanning', async(req, res) => {
    try {

        let today, day, month, year, hour, minute, second, msecond;
        //# UPDATE AND POPULATE THE DATES VARIABLES
        today = new Date(); //## current date
        day = ("0" + today.getDate()).slice(-2); //## adjust 0 before single digit date
        month = ("0" + (today.getMonth() + 1)).slice(-2); //## current month
        year = today.getFullYear(); //## current year
        hour = ("0" + (today.getHours())).slice(-2) //## current hour
        minute = ("0" + (today.getMinutes() + 1)).slice(-2); //## current minute
        second = ("0" + (today.getSeconds() + 1)).slice(-2); //## current second
        msecond = ("0" + (today.getMilliseconds() + 1)).slice(-3); //## current second

        let { rdd, invoice } = req.query;

        rdd =  typeof(rdd) === 'undefined' || rdd == '' ? '' : rdd;

        const filter = { 'rdd' : rdd, 'invoice' : invoice };

        const bookings = await bookingService.getBookings(filter);

        const dataPerSTC = await bookingService.getDataPerSTC(rdd);
        const dataPerCluster = await bookingService.getDataPerCluster(rdd);
        const dataPerCity = await bookingService.getDataPerCity(rdd);

        const shippoints = await masterService.getShipPointsPerRDD(rdd);

        let trgtfile = `Planning-for-rdd-${rdd}.xlsx`;
        if(fs.existsSync('./resources/Planner.xlsx')) {
            var workbook = new excel.Workbook(); //create new spreadsheet file
            await workbook.xlsx.readFile('./resources/Planner.xlsx') //## read the ODO Ramco template

            let sheet1 = workbook.getWorksheet("per STC"); //## declare the first worksheet to a variable
            let rowNum_1 = 2; //## starting row of sheet1 in populating data

            var dataPerSTC_harmonized = await dataPerSTC.filter(row => row.TruckType != null)
            for(let i of dataPerSTC_harmonized) {
                sheet1.getRow(rowNum_1).getCell('A').value = '';
                sheet1.getRow(rowNum_1).getCell('B').value = i['rdd'];
                sheet1.getRow(rowNum_1).getCell('C').value = i['ship_to_code'];
                sheet1.getRow(rowNum_1).getCell('D').value = i['consignee_id'];
                sheet1.getRow(rowNum_1).getCell('E').value = i['cluster_code'];
                sheet1.getRow(rowNum_1).getCell('F').value = i['city'];
                sheet1.getRow(rowNum_1).getCell('G').value = i['cbm'];
                sheet1.getRow(rowNum_1).getCell('H').value = i['CBM Util (Sedan)'];
                sheet1.getRow(rowNum_1).getCell('I').value = i['CBM Util (AUV)'];
                sheet1.getRow(rowNum_1).getCell('J').value = i['CBM Util (L300)'];
                sheet1.getRow(rowNum_1).getCell('K').value = i['CBM Util (4W)'];
                sheet1.getRow(rowNum_1).getCell('L').value = i['CBM Util (6W)'];
                sheet1.getRow(rowNum_1).getCell('M').value = i['TruckType'];
                rowNum_1++;
            }

            let sheet2 = workbook.getWorksheet("per Cluster"); //## declare the second worksheet to a variable
            let rowNum_2 = 2; //## starting row of sheet2 in populating data
            for(let i of dataPerCluster) {
                sheet2.getRow(rowNum_2).getCell('A').value = '';
                sheet2.getRow(rowNum_2).getCell('B').value = i['rdd'];
                sheet2.getRow(rowNum_2).getCell('C').value = i['cluster_code'];
                sheet2.getRow(rowNum_2).getCell('D').value = i['cbm'];
                sheet2.getRow(rowNum_2).getCell('E').value = i['wt'];
                sheet2.getRow(rowNum_2).getCell('F').value = i['CBM Util (Sedan)'];
                sheet2.getRow(rowNum_2).getCell('G').value = i['CBM Util (AUV)'];
                sheet2.getRow(rowNum_2).getCell('H').value = i['CBM Util (L300)'];
                sheet2.getRow(rowNum_2).getCell('I').value = i['CBM Util (4W)'];
                rowNum_2++;
            }

            let sheet3 = workbook.getWorksheet("per City"); //## declare the second worksheet to a variable
            let rowNum_3 = 2; //## starting row of sheet3 in populating data
            for(let i of dataPerCity) {
                sheet3.getRow(rowNum_3).getCell('A').value = '';
                sheet3.getRow(rowNum_3).getCell('B').value = i['rdd'];
                sheet3.getRow(rowNum_3).getCell('C').value = i['city'];
                sheet3.getRow(rowNum_3).getCell('D').value = i['cbm'];
                sheet3.getRow(rowNum_3).getCell('E').value = i['wt'];
                sheet3.getRow(rowNum_3).getCell('F').value = i['CBM Util (Sedan)'];
                sheet3.getRow(rowNum_3).getCell('G').value = i['CBM Util (AUV)'];
                sheet3.getRow(rowNum_3).getCell('H').value = i['CBM Util (L300)'];
                sheet3.getRow(rowNum_3).getCell('I').value = i['CBM Util (4W)'];
                rowNum_3++;
            }

            let sheet4 = workbook.getWorksheet("Orders"); //## declare the second worksheet to a variable
            let rowNum_4 = 2; //## starting row of sheet4 in populating data
            for(let i of bookings) {
                sheet4.getRow(rowNum_4).getCell('A').value = i['rdd'];
                sheet4.getRow(rowNum_4).getCell('B').value = i['br_no'];
                sheet4.getRow(rowNum_4).getCell('C').value = i['invoice'];
                sheet4.getRow(rowNum_4).getCell('D').value = i['ship_to_code'];
                sheet4.getRow(rowNum_4).getCell('E').value = i['principal'];
                sheet4.getRow(rowNum_4).getCell('F').value = i['cbm'];
                sheet4.getRow(rowNum_4).getCell('G').value = i['wt'];
                rowNum_4++;
            }

            let sheet5 = workbook.getWorksheet("ShipPoints"); //## declare the second worksheet to a variable
            let rowNum_5 = 2; //## starting row of sheet5 in populating data
            for(let i of shippoints) {
                sheet5.getRow(rowNum_5).getCell('A').value = i['ship_to_code'];
                sheet5.getRow(rowNum_5).getCell('B').value = i['ship_to_name'];
                sheet5.getRow(rowNum_5).getCell('C').value = i['ship_to_address'];
                sheet5.getRow(rowNum_5).getCell('D').value = i['consignee_id'];
                sheet5.getRow(rowNum_5).getCell('E').value = i['consignee_name'];
                sheet5.getRow(rowNum_5).getCell('F').value = i['cluster_code'];
                sheet5.getRow(rowNum_5).getCell('G').value = i['city'];
                rowNum_5++;
            }

            let targetfilePath = `./resources/ConvertedPlanned/${trgtfile}`;
            await workbook.xlsx.writeFile(targetfilePath);

            res.download(targetfilePath)
        }
        else { console.log('Template does not exist.')}
    }
    catch(e){
        console.log(e)
        // res.send(req.flash(`error_msg','ERROR : ${e}`));
        // res.redirect('/');
    }
})

router.post('/uploadBookingCSV', async(req, res) => {

    let { Filename_inp } = req.query;

    Filename_inp =  typeof(Filename_inp) === 'undefined' || Filename_inp == '' ? '' : Filename_inp;

    try{
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './resources/');
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
                // cb(null, file.originalname+path.extname(file.originalname));
            }
        });

        const uploadCSV = multer({
            storage: storage
        }).single('file_to_upload');

        return await uploadCSV(req, res, async(err) => {
            let csvString = fs.readFileSync(req.file.path).toString();//.replace(/"/g, '');
            // console.log(csvString, 'csvString')

            let data = Papa.parse(csvString, {header: true, skipEmptyLines: true});
            let rowWithoutInvoice = data.data.filter(row => 
                (typeof(row.invoice) == 'undefined' || row.invoice == '')
            )
            console.log(rowWithoutInvoice, 'rowWithoutInvoice')

            let InvoiceExist = await bookingService.getSameInvoice(req.file.originalname)
            // console.log(InvoiceExist,'InvoiceExist')
            if(data.errors.length > 0) {
                res.send(req.flash('error_msg', `Error : ${JSON.stringify(data.errors)}`));
                res.redirect(`/booking`);
            }
            else if(InvoiceExist.length > 0) {
                console.log(InvoiceExist)
                res.send(req.flash('error_msg', `Error : Invoice already exist in the bookings.`));
                res.redirect(`/booking`);
            }
            else if(rowWithoutInvoice.length > 0) {
                console.log(InvoiceExist)
                res.send(req.flash('error_msg', `Error : One or more rows has empty Invoice Name.`));
                res.redirect(`/booking`);
            }
            else {
                let file = { name : req.file.originalname,
                             uploadedFilePath : req.file.path 
                            };
                await bookingService.uploadCSVToBookingTable(file)
            }
        })
    }
    catch(e){
        console.log(e)
        res.send(req.flash('error_msg', `${e}`));
        res.redirect(`/bookings`);
    }
    finally {
        res.redirect('/booking');
    }
})

router.get('/generatePlan', async(req, res) => {
    try{
        res.render('../views/booking/create_plan', {})
    }
    catch(e){
        console.log(e)
        // res.send(req.flash(`error_msg','ERROR : ${e}`));
        // res.redirect('/');
    }
})

module.exports = router;