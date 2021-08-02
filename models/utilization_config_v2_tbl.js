module.exports = (sequelize,DataTypes) => {
    var utilization_config_v2_tbl = sequelize.define('utilization_config_v2_tbl', {
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
        truck_type: { 
            field: 'truck_type',
            type: DataTypes.STRING, 
            allowNull: false
        },
        allow_SM:{
            type: DataTypes.BOOLEAN, 
            allowNull: false
        },
        sm_drops:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        capacity:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        capacity_start_limit:{
            type:DataTypes.STRING,
            allowNull:false
        },
        radius:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        default_drops:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        default_sm_drops:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        default_allow_SM:{
            type: DataTypes.BOOLEAN, 
            allowNull: false
        },
        default_radius:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        default_capacity:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        default_capacity_start_limit:{
            type: DataTypes.STRING, 
            allowNull: false
        }
    }, {
      timestamps: false,
      freezeTableName: true,
      logging : false
    });
  
    return utilization_config_v2_tbl
  }
  