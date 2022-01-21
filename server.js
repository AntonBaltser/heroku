const express = require('express');
const cookieParser = require('cookie-parser')
const fs = require('fs')

let Minio = require('minio')
// const minioClient = new Minio.Client({
//     endPoint: 'play.min.io',
//     port: 9000,
//     useSSL: true,
//     accessKey: 'Q3AM3UQ867SPQQA43P2F',
//     secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
// });
var minioClient = new Minio.Client({
    endPoint: 'play.min.io',
    port: 9000,
    useSSL: true,
    accessKey: 'AKIAQVKU5JSQXKWLGRMV',
    secretKey: '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'
})
const kachPassword = require('./src/modules/kashPassword')
const cacheCreator = require('./src/modules/cacheCreator')

const db = require('./db');
const Users = db.users;

let app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded());
let token = cacheCreator()

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';

app.all('/*', (req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
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

var file = '/kart.jpg'

// Make a bucket called europetrip.
minioClient.makeBucket('europetrip', 'us-east-1', function(err) {
    if (err) return console.log(err)

    console.log('Bucket created successfully in "us-east-1".')

    var metaData = {
        'Content-Type': 'application/octet-stream',
        'X-Amz-Meta-Testing': 1234,
        'example': 5678
    }
    // Using fPutObject API upload your file to the bucket europetrip.
    minioClient.fPutObject('europetrip', 'photos-europe.tar', file, metaData, function(err, etag) {
        if (err) return console.log(err)
        console.log('File uploaded successfully.')
    });
});
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
    let data =  Buffer.from(JSON.stringify(req.body), 'base64')
    // let blob = Buffer.from(JSON.stringify(req.body), 'base64').toString('ascii')
    // console.log(blob)
    // let data = blob
    fs.createWriteStream('./static/upload/map1g1').write(data,() => console.dir('записанн файл'));
res.send('alles ok')
    // fs.createWriteStream('./static/upload/map1.jpeg').write(blob, 'utf-8',() => console.dir('записанн файл'));
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

        // console.log('Cookies: ', req.cookies)
        // console.log('Signed Cookies: ', req.signedCookies)
        res.send(login)
    }
    else res.send(login)

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
