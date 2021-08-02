// const Sequelize = require('sequelize');
// const db = require('./db.js');

module.exports = (sequelize,DataTypes) => {
  var bookings_tbl = sequelize.define('bookings_tbl', {
    invoice: { field: 'invoice',
                   type: DataTypes.STRING, 
                   allowNull: false
                  },
    br_no: { field: 'br_no',
                   type: DataTypes.STRING, 
                   allowNull: true
                  },
    ship_to_code: { field: 'ship_to_code',
                   type: DataTypes.STRING, 
                   allowNull: false
                  },
    rdd: { field: 'rdd',
                   type: DataTypes.DATE, 
                   allowNull: true
                  },
    principal: { field: 'principal',
                   type: DataTypes.STRING, 
                   allowNull: true
                  },
    cbm: { field: 'cbm',
                   type: DataTypes.DECIMAL(10,5), 
                   allowNull: true
                  },
    wt: { field: 'wt',
                   type: DataTypes.DECIMAL(10,5), 
                   allowNull: true
                  },
    br_status: { field: 'br_status',
                  type: DataTypes.STRING, 
                  allowNull: true
                  }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'bookings_tbl',
    logging : false
  });

  return bookings_tbl

}
