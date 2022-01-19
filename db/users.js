const Sequilize = require('sequelize');

module.exports = function (sequelize){
    return sequelize.define('users',{
        id:{
            type: Sequilize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        file_name: {
            type: Sequilize.STRING,
            allowNull: false
        },
        user_name: {
            type: Sequilize.STRING,
            allowNull: false
        },
        user_email: {
            type: Sequilize.STRING,
            allowNull: false
        },
        user_password: {
            type: Sequilize.STRING,
            allowNull: false
        },
        country: {
            type: Sequilize.STRING,
            allowNull: false
        },
        language: {
            type: Sequilize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequilize.STRING,
            allowNull: false
        },
        avatar: {
            type: Sequilize.BLOB,
            allowNull: false
        },
    },{
        timestamps: false,
        tableName: 'users'
    });

}
