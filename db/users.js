const Sequilize = require('sequelize');

module.exports = function (sequelize){
    return sequelize.define('users',{
        id:{
            type: Sequilize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        // user_avatar: {
        //     type: Sequilize.BLOB,
        //     allowNull: false
        // },
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
    },{
        timestamps: false,
        tableName: 'users'
    });

}
