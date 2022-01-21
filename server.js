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



app.post('/uploadPhoto',(req, res) => {
console.log(req.body)


    // const data = fs.readFileSync('./kart.jpg');
    var data =  Buffer.from(JSON.stringify(req.body), 'base64')
    // let blob = Buffer.from(JSON.stringify(req.body), 'base64').toString('ascii')
    // console.log(blob)
    // let data = blob
    fs.createWriteStream('./static/upload/map11').write(data,() => console.dir('записанн файл'));
res.send('alles ok')
    // fs.createWriteStream('./static/upload/map1.jpeg').write(blob, 'utf-8',() => console.dir('записанн файл'));
})




app.post('/auth',  async (req, res) =>{
    let body = req.body
    console.log(body)
    const loginAuth =
    await Users.findOne({
            where: {
                'user_email': body.email,
                'user_password': kachPassword(body.email, body.password)
            },
        } )
            .then(answer => answer !== null)
            .then(isLoginAuth => isLoginAuth);
    // loginAuth
    if(loginAuth === true) {

 res.cookie('token', token);

            console.dir(token)
        console.log('Cookies: ', req.cookies)
        console.log('Signed Cookies: ', req.signedCookies)
        res.send("ok")
    }
    else res.send('пошел нахер пидр!')

   })


app.post('/registration', async  (req, res) =>{
    let reqBody = req.body
    // console.dir('===============')
    // console.log(data)
    // let blob = Buffer.from(JSON.stringify(data.image), 'base64').toString('ascii')
    // console.log(blob)
    // let data1 = new Uint8Array(data)
    // console.log(data)
    // fs.writeFileSync('./image.png', data, 'utf-8')
    // fs.createWriteStream('./map1').write(blob, 'utf-8',() => console.dir('записанн файл'));
    // console.log('===============')
//    let pic = new Uint8Array(data);
//     let blob = new Blob([pic]);
// console.log(pic)


     await Users.create({
        'file_name': reqBody.image_name,
        'user_name': reqBody.name,
        'user_email': reqBody.email,
        'user_password': kachPassword(reqBody.email, reqBody.password),
        'avatar': reqBody.image,
        'country':  reqBody.country,
        'language': reqBody.language,
        'gender': reqBody.gender

    })

    res.send("ok")
});
