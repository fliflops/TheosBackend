// const Sequelize = require('sequelize');
// const db = require('./db.js');

module.exports = (sequelize,DataTypes) => {
    var utilization_config_tbl = sequelize.define('utilization_config_tbl', {
        id:{ 
            field: 'id',
            type: DataTypes.STRING, 
            primaryKey: true,
            allowNull: false
        },
        drops: { 
            field: 'drops',
            type: DataTypes.STRING, 
            allowNull: false
        },
        auv_drops: { 
            field: 'auv_drops',
            type: DataTypes.STRING, 
            allowNull: true
        },
        range: {
            field: 'range',
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch1_upper_limit: { 
            field: 'batch1_upper_limit',
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch1_lower_limit: { 
            field: 'batch1_lower_limit',
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch3_upper_limit: { 
            field: 'batch3_upper_limit',
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch3_lower_limit: { 
            field: 'batch3_lower_limit',
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch4_upper_limit: { 
            field: 'batch4_upper_limit',
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch4_lower_limit: { 
            field: 'batch4_lower_limit',
            type: DataTypes.STRING, 
            allowNull: true
        },
      
    }, {
      timestamps: false,
      freezeTableName: true,
      logging : false
    });
  
    return utilization_config_tbl
  
  }
  