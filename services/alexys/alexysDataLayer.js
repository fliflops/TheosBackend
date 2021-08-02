const db = require('../../config/db');
const scmdb = require('../../scmdb_models/scmdb.js');

exports.getLoadedDataByLoadSheet = async (loadSheetNo) => {
	//loadSheetNo

	return await scmdb.query(` sp_getLoadedDataByLoadSheet_exec_cdi
		'${typeof(loadSheetNo) === 'undefined' ? '' :  loadSheetNo}'
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
