const express = require('express');
const cookieParser = require('cookie-parser')

const kachPassword = require('./src/modules/kashPassword')
const cacheCreator = require('./src/modules/cacheCreator')

const db = require('./db');
const Users = db.users;

let app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded());

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

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


app.post('/auth',async (req, res) =>{
    let body = req.body
    const loginAuth =
        await Users.findOne({
            where: {
                user_email: body.email,
                user_password: kachPassword(body.email, body.password)
            },
        } )
            .then(token => token !== null)
            .then(isLoginAuth => isLoginAuth);

    if(loginAuth) {
        let cache = cacheCreator()
        res.cookie('cache', cache );
        res.cookie('id','lalal');


        console.log('Cookies: ', req.cookies)


        console.log('Signed Cookies: ', req.signedCookies)
        res.send("ok")
    }
    else res.send('пошел нахер пидр!')

   })






app.post('/registration',async (req, res) =>{
    let body = req.body

     await Users.create({
        'file_name': body.image['fileName'],
        'user_name': body.name,
        'user_email': body.email,
        'user_password': kachPassword(body.email, body.password),
        'avatar': body.image.file,
        'country': body.country,
        'language': body.language,
        'gender': body.gender

    })

    res.send("ok")
});
