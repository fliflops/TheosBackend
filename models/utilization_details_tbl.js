// const Sequelize = require('sequelize');
// const db = require('./db.js');

module.exports = (sequelize,DataTypes) => {
    var utilization_details_tbl = sequelize.define('utilization_details_tbl', {
        id:{ 
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        transcation_id: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
        rdd: { 
            type: DataTypes.STRING, 
            allowNull: true
        },
        ship_to_code: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        consignee_id: { 
            type: DataTypes.STRING, 
            allowNull: true
        },
        city: { 
            type: DataTypes.STRING, 
            allowNull: true
        },
        total_cbm: { 
            type: DataTypes.DECIMAL(18,9), 
            allowNull: true
        },
        total_wt: { 
            type: DataTypes.DECIMAL(18,9), 
            allowNull: true
        },
        truck_cbm_util: { 
            type: DataTypes.DECIMAL(18,9), 
            allowNull: true
        },
        truck_wt_util: { 
            type: DataTypes.DECIMAL(18,9), 
            allowNull: true
        },
        util_factor:{
            type: DataTypes.DECIMAL(18,9), 
            allowNull: true
        },
        truck_type: { 
            type: DataTypes.STRING, 
            allowNull: true
        },
        truck_no: { 
            type: DataTypes.INTEGER, 
            allowNull: true
        },
        drop: { 
            type: DataTypes.INTEGER, 
            allowNull: true
        },
        creted_date: { 
            type: DataTypes.STRING, 
            allowNull: true
        },
      
    }, {
      timestamps: false,
      freezeTableName: true,
      logging : false
    });
  
    return utilization_details_tbl
  
  }
  