// const order_export_tbl = require('../../models/order_export_tbl.js');
// const booking_tbl = require('../../models/bookings_tbl.js');
// const db = require('../../config/db');
const models = require('../../models');
const {sequelize} = models

const moment = require('moment');

exports.getBookings = async ({
	rdd,
	invoice
}) => {
// filter {
	//rdd, 
	//invoice }

	return await sequelize.query(` sp_bookings_exec_cdi
		'${typeof rdd 		=== 'undefined' ? '' :  rdd}',
		'${typeof invoice 	=== 'undefined' ? '' :  invoice}'
	`,{
		type:'SELECT'
	})
	.then(result => {
		return JSON.parse(JSON.stringify(result))
	})
	.catch(e => {
		console.log(`error: ${e}`)
		throw new Error(`${e}`)
	})
}

exports.getBookingsPerStc = async ({
		deliveryDate
	}) => {
	return await sequelize.query(`
		sp_bookings_util_exec
		'${typeof deliveryDate !== 'undefined' ? deliveryDate : ''}'

	`,{
		type:'SELECT'
	})
	.then(result => {
		return JSON.parse(JSON.stringify(result))
	})
	.catch(e => {
		console.log(`error: ${e}`)
		throw new Error(`${e}`)
	})
}

exports.insertBooking = async (jsonData, file) => {
	//filter =
		//config

	const createdDate = moment().format('YYYY-MM-DD HH:mm:ss.sss');

	try {
		for(let lineItem of jsonData) {
			await models.bookings_tbl.create({
				invoice : 					lineItem['invoice'],
				br_no : 					lineItem['br_no'] == '' ? null : lineItem['br_no'],
				ship_to_code : 				lineItem['ship_to_code'] == '' ? null : lineItem['ship_to_code'],
				rdd : 						lineItem['rdd'] == '' ? null : moment(lineItem['rdd']).format('YYYY-MM-DD'),
				principal : 				lineItem['principal'] == '' ? null : lineItem['principal'],
				cbm : 						lineItem['cbm'] == '' ? null : lineItem['cbm'],
				wt : 						lineItem['wt'] == '' ? null : lineItem['wt'],
				br_status : 				lineItem['br_status'] == '' ? null : lineItem['br_status'],
				cdi_Created_Date : 			createdDate,
				cdi_Filename : 				file.name
			})
		}
	}
	catch(e) {
		console.log(e)
		throw new Error(`${e}`)
	}
}

exports.getSameInvoice = async (invoice) => {
	//invoice
	return await sequelize.query(`sp_getSameInvoice_cdi
		'${typeof(invoice) === 'undefined' ? '' :  invoice}'
	`,{
		type:'SELECT'
	})
	.then(result => {
		return JSON.parse(JSON.stringify(result))
	})
	.catch(e => {
		console.log(`error: ${e}`)
		throw new Error(`${e}`)
	})
}
