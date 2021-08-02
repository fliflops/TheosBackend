module.exports = (sequelize,DataTypes) => {
    var utilization_tbl = sequelize.define('utilization_header_tbl', {
        transction_id:{ 
            field: 'transction_id',
            type: DataTypes.STRING, 
            primaryKey: true,
            allowNull: false
        },
        delivery_date: { 
            field: 'delivery_date',
            type: DataTypes.STRING, 
            allowNull: true
        },
        rdd_from: { 
            field: 'rdd_from',
            type: DataTypes.STRING, 
            allowNull: true
        },
        rdd_to: { 
            field: 'rdd_to',
            type: DataTypes.STRING, 
            allowNull: true
        },
        config_id: { 
            field: 'config_id',
            type: DataTypes.STRING, 
            allowNull: true
        },
        date_created:{
            field: 'date_created',
            type: DataTypes.STRING, 
            allowNull: false
        },
        drops:{
            type: DataTypes.STRING, 
            allowNull: true
        },
        auv_drops:{
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch1_upper_limit:{
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch1_lower_limit:{
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch3_upper_limit:{
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch3_lower_limit:{
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch4_upper_limit:{
            type: DataTypes.STRING, 
            allowNull: true
        },
        batch4_lower_limit:{
            type: DataTypes.STRING, 
            allowNull: true
        }
  
    }, {
      timestamps: false,
      freezeTableName: true,
      logging : false
    });
  
    return utilization_tbl

  }
  