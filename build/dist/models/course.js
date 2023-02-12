"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');
// module.exports = sequelize.define('video', {
exports.Video = sequelize.define('videos', {
    videoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    video_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    video_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fileName: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // userId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});
