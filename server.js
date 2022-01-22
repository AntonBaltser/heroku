const express = require('express');

const cookieParser = require('cookie-parser')
const uploadFile = require('./src/routing/uploadFile')
const registration = require('./src/routing/registration')
const auth = require('./src/routing/auth')
const verification = require('./src/modules/plugins/verification')
let app = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded());

const setHeaders = require('./src/routing/setHeders')
app.all('/*', (req, res, next) => {
    setHeaders(req, res, next)
});
let server = app.listen(4000, (req, res) =>{
        let host = server.address().address
        let port = server.address().port
        console.log("Сервер рабтает по адрессу http://%s:%s", host, port)
})

app.post('*', async (req, res) => {
     switch(req.url){
    case '/verificationName':
        return verification(req, res, {'user_name': req.body.name})

    case '/verificationEmail':
        return verification(req, res, {'user_email': req.body.email})

    case '/uploadPhoto':
        return uploadFile(req, res)

    case '/auth':
        return  auth(req, res)

    case '/registration':
         return   registration(req, res)

    default:
        return "application/octate-stream";
}
})


