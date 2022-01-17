const Sequilize = require('sequelize');

const sequelize = new Sequilize('project_VUE', 'antony', 'bp024W', {
    dialect: "mysql",
    host: "localhost"
});


const users = require('./users')(sequelize);

module.exports = {
    sequelize: sequelize,
    users: users,
}
