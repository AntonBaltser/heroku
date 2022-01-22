const kachPassword = require("../modules/kashPassword");
const db = require('../../db');
const Users = db.users;
const token = require('../modules/cacheCreator')

module.exports = async (req, res) => {

    let body = req.body
    console.log(body)
    let login = '';
    const loginAuth = await Users.findOne({
            where: {
                'user_email': body.email,
                'user_password': kachPassword(body.email, body.password)
            },
        })
            .then(answer => {
                login = answer?.user_name || 'no_login'
                return answer !== null
            })
            .then(bool => {
                console.log(bool)
                return bool
            });
    if(loginAuth === true) {

        res.cookie('token', token());
        res.cookie('login', login);

        res.send(login)
    }
    else res.send(login)
}