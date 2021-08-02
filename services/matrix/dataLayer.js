const models = require('../../models');
const {sequelize} = models

exports.retrieveMatrix = async() => {
    return await models.drop_matrix_tbl
    .findAll()
    .then(result => {
        return JSON.parse(JSON.stringify(result))
    })
}
