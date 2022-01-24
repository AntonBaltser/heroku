const Sequilize = require('sequelize');

module.exports = function (sequelize){
    return sequelize.define('authent',{
        id:{
            type: Sequilize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        login: {
            type: Sequilize.STRING,
            allowNull: false
        },
        cookie: {
            type: Sequilize.STRING,
            allowNull: false
        },
    },{
        timestamps: false,
        tableName: 'authent'
    });
}
