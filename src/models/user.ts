const { DataTypes } = require('sequelize');
const sequelize = require('../util/db')

// const sequelize = new Sequelize('postgres://fyp_4lpx_user:n3z586VYHFVXHPbB2Kks3RCXtjdrAMuT@dpg-cfi2ur82i3murcddg3g0-a.frankfurt-postgres.render.com/fyp_4lpx')


export type UserModel = typeof sequelize.Model;


// module.exports = sequelize.define('user', {
export const User = sequelize.define('user', {

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
    timestamps: true    // Other model options go here
});

