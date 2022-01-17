const express = require('express');


// const db = require('./db');
// const Users = db.users;

let app = express();
app.use(express.json());
app.use(express.urlencoded());

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

let server = app.listen(4000, () =>{
        let host = server.address().address
        let port = server.address().port
        console.log("Сервер рабтает по адрессу http://%s:%s", host, port)
})

app.get('/', (req, res) => {
        res.send('hello word')

        console.log(req.body)

        // Users.create({
        //         file_name: 'Anton',
        //         user_name: 'Banddldf',
        //         user_email: 'qweqweqwe',
        //         user_password: 'qweqweqw'
        // })
});
