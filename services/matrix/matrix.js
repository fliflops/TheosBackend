const dataLayer = require('./dataLayer');

exports.matrix = async({
    dropCount,
}) => {
    const matrix = await dataLayer.retrieveMatrix()

    if(typeof dropCount === 'undefined'){
        return matrix
    }
    else{
        return matrix.filter(item => {
            return dropCount >= item.drop_count 
        })
    }
}