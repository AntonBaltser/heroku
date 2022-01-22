const s3 = require("../minio/connection");
module.exports = (req, res) => {
    let avatar = new Buffer.from(req.body.blob, 'base64'); // decode

    let params = {Bucket: 'project/registration/users', Key: req.body.name, Body: avatar};

    s3.putObject(params, (err, data) => {
        if (err){
            console.log(err)
            return res.send('alles nicht so gut')
        }
        else
            console.dir("Successfully uploaded data to project/registration/users/ ---" + req.body.name);
        return res.send('alles ok');
    });
}