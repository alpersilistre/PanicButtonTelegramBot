const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const axios = require('axios');
const port = 3000;

let chatId;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, database) => {
    const myDb = database.db('panicbutton');
    if (err) return console.log(err);

    require('./app/routes')(app, myDb);
    app.listen(port, () => {
        console.log("live on " + port);
    });
});