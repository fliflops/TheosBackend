const Sequelize = require('sequelize');
// const { sequelize } = require('.');
// const db = require('./db.js');

module.exports = (sequelize,DataTypes) => {
    return sequelize.define('drop_matrix_tbl', {
        sequence_id:{
            field: 'sequence_id',
            primaryKey:true,
            allowNull: false,
            type: DataTypes.INTEGER                     
        },
        drop_1:{
            field: 'drop_1',
            allowNull: true,
            type: DataTypes.INTEGER                     
        },
        drop_2:{
            field: 'drop_2',
            allowNull: true,
            type: DataTypes.INTEGER     
        },
        drop_3:{
            field: 'drop_3',
            allowNull: true,
            type: DataTypes.INTEGER     
        },
        drop_4:{
            field: 'drop_4',
            allowNull: true,
            type: DataTypes.INTEGER     
        },
        drop_5:{
            field: 'drop_5',
            allowNull: true,
            type: DataTypes.INTEGER     
        },
        drop_6:{
            field: 'drop_6',
            allowNull: true,
            type: DataTypes.INTEGER     
        },
        drop_7:{
            field: 'drop_7',
            allowNull: true,
            type: DataTypes.INTEGER         
        },
        drop_8:{
            field: 'drop_8',
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
