"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');
// module.exports = sequelize.define('user', {
exports.User = sequelize.define('user', {
    // Model attributes are defined here
    _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    displayPicture: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    timestamps: true // Other model options go here
});
