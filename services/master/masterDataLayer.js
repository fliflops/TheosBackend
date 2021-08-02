const db = require('../../config/db');
const moment = require('moment');

exports.getShipPoints = async (filter) => {
// filter {
	//stc_inp}

	return await db.query(` sp_stc_exec_cdi
		'${typeof filter.stc_inp	=== 'undefined' ? '' :  filter.stc_inp}'
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

exports.getShipPointsPerRDD = async (rdd) => {
	// filter {
	
		return await db.query(` sp_stcPerRDD_cdi
			'${typeof rdd === 'undefined' ? '' :  rdd}'
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

exports.getBookingsByFilename = async (filter) => {
	// filter {
		//filename }
	
	return await db.query(` sp_bookings_byFilename_exec_cdi
		'${typeof filter.filename === 'undefined' ? '' :  filter.filename}'
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

exports.getBookingsByFilenameForODO = async (filter) => {
	// filter {
		//filename }
	
	return await db.query(` sp_bookings_byFilenameForODO_exec_cdi
		'${typeof filter.filename 	=== 'undefined' ? '' :  filter.filename}'
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

exports.getProcessedOrders = async (whLoc) => {
	// filter {
		//whLoc }

	return await db.query(`sp_ProcessedOrders_exec_cdi
		'${typeof whLoc === 'undefined' ? '' : whLoc}'
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

exports.getAreaCodeList = async() => {

	return await db.query(`sp_AreaCodeList_exec_cdi`
	,{
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

exports.insertOrder = async (jsonData, file) => {
	//filter =
		//config

	const createdDate = moment().format('YYYY-MM-DD HH:mm:ss.sss');

	try {
		for(let lineItem of jsonData) {

			let isAlreadyMaintained = await order_export_tbl.findOne({
						where : { 	Name : lineItem['Name'],
									Lineitem_sku : lineItem['Lineitem sku'] == '' ? null : lineItem['Lineitem sku'],
									cdi_Filename : file.name }
					});

			if(isAlreadyMaintained == null) {
				await order_export_tbl.create({
					Name : 							lineItem['Name'],
					Email : 						lineItem['Email'] == '' ? null : lineItem['Email'],
					Financial_Status : 				lineItem['Financial Status'] == '' ? null : lineItem['Financial Status'],
					Paid_at : 						lineItem['Paid at'] == '' ? null : lineItem['Paid at'],
					Fulfillment_Status : 			lineItem['Fulfillment Status'] == '' ? null : lineItem['Fulfillment Status'],
					Fulfilled_at : 					lineItem['Fulfilled at'] == '' ? null : lineItem['Fulfilled at'],
					Accepts_Marketing : 			lineItem['Accepts Marketing'] == '' ? null : lineItem['Accepts Marketing'],
					Currency : 						lineItem['Currency'] == '' ? null : lineItem['Currency'],
					Subtotal : 						lineItem['Subtotal'] == '' ? null : lineItem['Subtotal'],
					Shipping : 						lineItem['Shipping'] == '' ? null : lineItem['Shipping'],
					Taxes : 						lineItem['Taxes'] == '' ? null : lineItem['Taxes'],
					Total : 						lineItem['Total'] == '' ? null : lineItem['Total'],
					Discount_Code : 				lineItem['Discount Code'] == '' ? null : lineItem['Discount Code'],
					Discount_Amount : 				lineItem['Discount Amount'] == '' ? null : lineItem['Discount Amount'],
					Shipping_Method : 				lineItem['Shipping Method'] == '' ? null : lineItem['Shipping Method'],
					Created_at : 					lineItem['Created at'] == '' ? null : lineItem['Created at'],
					Lineitem_quantity : 			lineItem['Lineitem quantity'] == '' ? null : lineItem['Lineitem quantity'],
					Lineitem_name : 				lineItem['Lineitem name'] == '' ? null : lineItem['Lineitem name'],
					Lineitem_price : 				lineItem['Lineitem price'] == '' ? null : lineItem['Lineitem price'],
					Lineitem_compare_at_price : 	lineItem['Lineitem compare at price'] == '' ? null : lineItem['Lineitem compare at price'],
					Lineitem_sku : 					lineItem['Lineitem sku'] == '' ? null : lineItem['Lineitem sku'],
					Lineitem_requires_shipping : 	lineItem['Lineitem requires shipping'] == '' ? null : lineItem['Lineitem requires shipping'],
					Lineitem_taxable : 				lineItem['Lineitem taxable'] == '' ? null : lineItem['Lineitem taxable'],
					Lineitem_fulfillment_status : 	lineItem['Lineitem fulfillment status'] == '' ? null : lineItem['Lineitem fulfillment status'],
					Billing_Name : 					lineItem['Billing Name'] == '' ? null : lineItem['Billing Name'],
					Billing_Street : 				lineItem['Billing Street'] == '' ? null : lineItem['Billing Street'],
					Billing_Address1 : 				lineItem['Billing Address1'] == '' ? null : lineItem['Billing Address1'],
					Billing_Address2 : 				lineItem['Billing Address2'] == '' ? null : lineItem['Billing Address2'],
					Billing_Company : 				lineItem['Billing Company'] == '' ? null : lineItem['Billing Company'],
					Billing_City : 					lineItem['Billing City'] == '' ? null : lineItem['Billing City'],
					Billing_Zip : 					lineItem['Billing Zip'] == '' ? null : lineItem['Billing Zip'],
					Billing_Province : 				lineItem['Billing Province'] == '' ? null : lineItem['Billing Province'],
					Billing_Country : 				lineItem['Billing Country'] == '' ? null : lineItem['Billing Country'],
					Billing_Phone : 				lineItem['Billing Phone'] == '' ? null : lineItem['Billing Phone'],
					Shipping_Name : 				lineItem['Shipping Name'] == '' ? null : lineItem['Shipping Name'],
					Shipping_Street : 				lineItem['Shipping Street'] == '' ? null : lineItem['Shipping Street'],
					Shipping_Address1 : 			lineItem['Shipping Address1'] == '' ? null : lineItem['Shipping Address1'],
					Shipping_Address2 : 			lineItem['Shipping Address2'] == '' ? null : lineItem['Shipping Address2'],
					Shipping_Company : 				lineItem['Shipping Company'] == '' ? null : lineItem['Shipping Company'],
					Shipping_City : 				lineItem['Shipping City'] == '' ? null : lineItem['Shipping City'],
					Shipping_Zip : 					lineItem['Shipping Zip'] == '' ? null : lineItem['Shipping Zip'],
					Shipping_Province : 			lineItem['Shipping Province'] == '' ? null : lineItem['Shipping Province'],
					Shipping_Country : 				lineItem['Shipping Country'] == '' ? null : lineItem['Shipping Country'],
					Shipping_Phone : 				lineItem['Shipping Phone'] == '' ? null : lineItem['Shipping Phone'],
					Notes : 						lineItem['Notes'] == '' ? null : lineItem['Notes'],
					Note_Attributes : 				lineItem['Note Attributes'] == '' ? null : lineItem['Note Attributes'],
					Cancelled_at : 					lineItem['Cancelled at'] == '' ? null : lineItem['Cancelled at'],
					Payment_Method : 				lineItem['Payment Method'] == '' ? null : lineItem['Payment Method'],
					Payment_Reference : 			lineItem['Payment Reference'] == '' ? null : lineItem['Payment Reference'],
					Refunded_Amount : 				lineItem['Refunded Amount'] == '' ? null : lineItem['Refunded Amount'],
					Vendor : 						lineItem['Vendor'] == '' ? null : lineItem['Vendor'],
					Id : 							lineItem['Id'] == '' ? null : lineItem['Id'],
					Tags : 							lineItem['Tags'] == '' ? null : lineItem['Tags'],
					Risk_Level : 					lineItem['Risk Level'] == '' ? null : lineItem['Risk Level'],
					Source : 						lineItem['Source'] == '' ? null : lineItem['Source'],
					Lineitem_discount : 			lineItem['Lineitem discount'] == '' ? null : lineItem['Lineitem discount'],
					Tax_1_Name : 					lineItem['Tax 1 Name'] == '' ? null : lineItem['Tax 1 Name'],
					Tax_1_Value : 					lineItem['Tax 1 Value'] == '' ? null : lineItem['Tax 1 Value'],
					Tax_2_Name : 					lineItem['Tax 2 Name'] == '' ? null : lineItem['Tax 2 Name'],
					Tax_2_Value : 					lineItem['Tax 2 Value'] == '' ? null : lineItem['Tax 2 Value'],
					Tax_3_Name : 					lineItem['Tax 3 Name'] == '' ? null : lineItem['Tax 3 Name'],
					Tax_3_Value : 					lineItem['Tax 3 Value'] == '' ? null : lineItem['Tax 3 Value'],
					Tax_4_Name : 					lineItem['Tax 4 Name'] == '' ? null : lineItem['Tax 4 Name'],
					Tax_4_Value : 					lineItem['Tax 4 Value'] == '' ? null : lineItem['Tax 4 Value'],
					Tax_5_Name : 					lineItem['Tax 5 Name'] == '' ? null : lineItem['Tax 5 Name'],
					Tax_5_Value : 					lineItem['Tax 5 Value'] == '' ? null : lineItem['Tax 5 Value'],
					Phone : 						lineItem['Phone'] == '' ? null : lineItem['Phone'],
					Receipt_Number : 				lineItem['Receipt Number'] == "" ? null : lineItem['Receipt Number'],
					cdi_Created_Date : 				createdDate,
					cdi_Filename : 					file.name
				})
			}
		}
	}
	catch(e) {
		console.log(e)
		throw new Error(`${e}`)
	}
}
