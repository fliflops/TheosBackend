const dataLayer = require('./datalayer');
const nodemailer = require('nodemailer');
const moment = require('moment');

exports.crossdockReport = async ({
    location,
    rdd
}) => {
    try{

        const mail = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'li_reporting@logistikus.com',
                pass:'logistikus12345'
            }
        })

        const data = await dataLayer.crossdockReport({
            location,
            rdd
        })

        
        mail.sendMail({
            from:'li_reporting@logistikus.com',
            to:'velindayag@codedisruptors.com',
            subject:`RDD ${data[0].delivery_date} ${location} Crossdock Report`,
            html:`
                <style>
                    #table1 {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                </style>
                <table id='table1'>
                    <tr>
                        <th>QUANTITY</th>
                        <th>UOM</th>
                    </tr>
                    <tr>
                        <td>${data[0].total_case}</td>
                        <td>CS</td>
                    </tr>
                    <tr>
                        <td>${data[0].total_piece}</td>
                        <td>PCS</td>
                    </tr>
                    <tr>
                        <td>${data[0].total_quantity}</td>
                        <td>Total Quantity (Including Redel)</td>
                    </tr>
                    <tr>
                        <td><strong>Total CBM</strong></td>
                        <td>${data[0].total_cbm}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Stores</strong></td>
                        <td>${data[0].total_stores}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Truck Requirements</strong></td>
                        <td>${data[0].total_trucks}</td>
                    </tr>
                </table>
                <br>
                <table>
                    <tr>
                        <th>Truck Requirements</td>
                        <th>Truck Types</th>
                    </tr>
                    <tr>
                        <td>${data[0].AUV}</td>
                        <td>AUV</td>
                    </tr>
                    <tr>
                        <td>${data[0].L300}</td>
                        <td>L300</td>
                    </tr>
                    <tr>
                        <td>${data[0]['4W']}</td>
                        <td>4W</td>
                    </tr>
                    <tr>
                        <td>${data[0]['6W']}</td>
                        <td>6W</td>
                    </tr>
                    <tr>
                        <td>${data[0]['6WF']}</td>
                        <td>6WF</td>
                    </tr>
                    <tr>
                        <td>${data[0]['6WR']}</td>
                        <td>6WR</td>
                    </tr>
                    <tr>
                        <td>${data[0]['10W']}</td>
                        <td>10W</td>
                    </tr>
                </table>
            `
            },(error,info)=> {
            if(error){
                throw error
            }
            else{
                console.log('Email sent: ' + info.response);
            }
        })


        return data
    }
    catch(e){
        throw e
    }
}