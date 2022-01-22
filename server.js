const express = require('express');
const cookieParser = require('cookie-parser')
const fs = require('fs')

var AWS = require('aws-sdk');

var s3  = new AWS.S3({
    accessKeyId: 'antony' ,
    secretAccessKey: 'bp024Wbp024W' ,
    endpoint: 'http://127.0.0.1:9000' ,
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4'
});


const kachPassword = require('./src/modules/kashPassword')
const cacheCreator = require('./src/modules/cacheCreator')

const db = require('./db');
const Users = db.users;

let app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded());
let token = cacheCreator()

app.all('/*', (req, res, next) => {
-
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

let server = app.listen(4000, (req, res) =>{
        let host = server.address().address
        let port = server.address().port
        console.log("Сервер рабтает по адрессу http://%s:%s", host, port)
})

app.post('/verificationName',async (req, res) => {

    const verificationName = await  Users.findOne({
            where: {
                'user_name': req.body.name
            },
        } )
            .then(token => token !== null)
            .then(bool => bool);
    if(verificationName === true) res.send(false)
    else res.send(true)

})

app.post('/verificationEmail',async (req, res) => {
    console.log(req.body)

    const verificationEmail = await Users.findOne({
        where: {
            'user_email': req.body.email,
        },
    } )
        .then(answer => answer !== null)
        .then(bool => bool);
    console.log(verificationEmail)
    if(verificationEmail === true) res.send(false)
    else res.send(true)

})



app.post('/uploadPhoto',
(req, res) => {

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

})


app.post('/auth',  async (req, res) =>{
    let body = req.body
    console.log(body)
    let login = '';
    const loginAuth =
    await Users.findOne({
            where: {
                'user_email': body.email,
                'user_password': kachPassword(body.email, body.password)
            },
        })
            .then(answer => {
                login = answer?.user_name || 'no_login'
                return answer !== null
            })
            .then(isLoginAuth => {
                console.log(isLoginAuth)
                return isLoginAuth
            });
    if(loginAuth === true) {

 res.cookie('token', token);
 res.cookie('login', login);

        res.send(login)
    }
    else res.send(login)

   })

app.post('/registration',  (req, res) =>{
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
});
