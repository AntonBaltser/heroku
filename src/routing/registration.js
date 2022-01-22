const kachPassword = require("../modules/kashPassword");
const db = require('../../db');
const Users = db.users;
module.exports = (req, res) =>{
    let reqBody = req.body
    Users.create({
        'user_name': reqBody.name,
        'user_email': reqBody.email,
        'user_password': kachPassword(reqBody.email, reqBody.password),
        'avatarURL': 'http://localhost:9000/project/registration/users/' + reqBody.fileName,
        'country':  reqBody.country,
        'language': reqBody.language,
        'gender': reqBody.gender
    })
    res.send("ok")
}