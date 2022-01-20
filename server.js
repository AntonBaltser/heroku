const express = require('express');
const cookieParser = require('cookie-parser')
const fs = require('fs')

const kachPassword = require('./src/modules/kashPassword')
const cacheCreator = require('./src/modules/cacheCreator')


const db = require('./db');
const Users = db.users;

let app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded());
let token = cacheCreator()

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

let server = app.listen(4000, (req, res) =>{
        let host = server.address().address
        let port = server.address().port
        console.log("Сервер рабтает по адрессу http://%s:%s", host, port)
})



app.post('/verificationName',async (req, res) => {
    const verificationName =
        await Users.findOne({
            where: {
                'user_name': req.body.name
            },
        } )
            .then(token => token)
            .then(bool => bool);
    if(verificationName) res.send(false)
    else res.send(true)

})



app.post('/verificationEmail',async (req, res) => {
    const verificationEmail =
        await Users.findOne({
            where: {
                'user_email': req.body.email
            },
        } )
            .then(token => token)
            .then(bool => bool);
    if(verificationEmail) res.send(false)
    else res.send(true)
})



app.post('/auth',async (req, res) =>{
    let body = req.body
    const loginAuth =
        await Users.findOne({
            where: {
                'user_email': body.email,
                'user_password': kachPassword(body.email, body.password)
            },
        } )
            .then(token => token)
            .then(isLoginAuth => isLoginAuth);

    if(loginAuth) {

       await res.cookie('token', token);
       // await res.cookie('id','lalal');

            console.dir(token)
        console.log('Cookies: ', req.cookies)


        console.log('Signed Cookies: ', req.signedCookies)
        res.send("ok")
    }
    else res.send('пошел нахер пидр!')

   })


app.post('/registration', async  (req, res) =>{
    let data = req.body

 console.log(data)

//    let pic = new Uint8Array(data);
//     let blob = new Blob([pic]);
// console.log(pic)


     await Users.create({
        'file_name': 'body.image_name',
        'user_name': 'body.name',
        'user_email': 'body.email',
        'user_password': 'kachPassword(body.email, body.password)',
        'avatar': data,
        'country': 'body.country',
        'language':' body.language',
        'gender': 'body.gender'

    })

    res.send("ok")
});
