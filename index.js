const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const axios = require('axios');
// const db = require('./config/db');
const port = 3000;
let path = require('path');

let chatId;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/app')));

MongoClient.connect('mongodb://alpersilistre:123456@ds161336.mlab.com:61336/panicbutton', (err, database) => {
    const myDb = database.db('panicbutton');
    if (err) return console.log(err);

    require('./app/routes')(app, myDb);
    app.listen(port, () => {
        console.log("live on " + port);
    });
});