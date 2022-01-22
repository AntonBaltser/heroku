const db = require('../../../db');
const Users = db.users;

module.exports = async (req, res, params) => {
    const verification = await Users.findOne({
        where: params
    } )
        .then(answer => answer !== null)
        .then(bool => bool);
    console.log(verification)
    if(verification === true) res.send(false)
    else res.send(true)
}