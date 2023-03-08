const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
// module.exports = () => {


//     try {
//         sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// }

module.exports = new Sequelize(process.env.DATABASE_API_KEY, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: true,
        native: true
    }
})

// module.exports = sequelize;