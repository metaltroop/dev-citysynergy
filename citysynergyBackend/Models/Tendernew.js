const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const tendernew = sequelize.define('tenders', {
    Tender_ID: {
        type: DataTypes.STRING,
        unique: "Tender_ID",
        allowNull: false,
        primaryKey:true,
    },
    
    Tender_By_Department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Tender_By_Classification: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Sanction_Date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    Completion_Date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    Sanction_Amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    Total_Duration_Days: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Priorities: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Cancel_Accept_Tenders: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Reason_for_Decision: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Tender_Status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Reason_for_Status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Completed_Pending: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Tender_Acquired_By_Agency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    local_area_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    area_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false, 
});


module.exports = tendernew