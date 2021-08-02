const Sequelize = require('sequelize');
// const { sequelize } = require('.');
// const db = require('./db.js');

module.exports = (sequelize,DataTypes) => {
    return sequelize.define('truck_utilized_hdr', {
        sequence_id:{
            field: 'sequence_id',
            primaryKey:true,
            allowNull: false,
            type: DataTypes.INTEGER
        },
        drops:{
            field: 'drops',
            allowNull: true,
            type: DataTypes.INTEGER
        },
        higher_limit:{
            field: 'higher_limit',
            allowNull: true,
            type: DataTypes.INTEGER
        },
        lower_limit:{
            field: 'lower_limit',
            allowNull: true,
            type: DataTypes.INTEGER
        },
        total:{
            field: 'total',
            allowNull: true,
            type: DataTypes.INTEGER
        },
        drop_count:{
            field: 'drop_count',
            allowNull: true,
            type: DataTypes.INTEGER
        }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'drop_matrix_tbl',
    logging : false
  });
}

// module.exports = drop_matrix_tbl;
