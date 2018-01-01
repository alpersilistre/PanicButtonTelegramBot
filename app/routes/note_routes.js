let ObjectID = require('mongodb').ObjectID;
const baseUrl = 'https://api.telegram.org/bot';
const botApiToken = '483461591:AAGG0iNPgfQyEWJbf6glcuF1yBtyOjSD6ZA';
const axios = require('axios');
let path = require('path');
let updateId;
let newUpdateNumber;
let updateIdObjectPrimaryKey;

module.exports = function(app, db) {

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../index.html'));
    });

    app.get('/getUpdates', (req, res) => {        
        db.collection('telegram').find({}).toArray((err, items) => {
            if(err) {
                res.send({ 'error': 'An error has occurred' });
            } else {                
                updateId = items[0].updateId;

                let url = `${baseUrl}${botApiToken}/getUpdates?offset=${updateId}`;
                axios.get(url)
                .then(response => {
                    if(response.data.result[0] !== undefined) {
                        newUpdateNumber = parseInt(updateId) + 1;
                        let details = { '_id': new ObjectID(items[0]._id) };
                        let updatedObj = { updateId: newUpdateNumber };
                        let chatIdFromResponse = response.data.result[0].message.chat.id.toString();

                        // Add new user to the Db
                        let user = { 
                            chatId: chatIdFromResponse,
                            name: response.data.result[0].message.chat.first_name,
                            email: ''
                        };

                        db.collection('users').insert(user, (err, results) => {
                            err ? res.send({ 'error': 'An error has occurred' }) : console.log('User added to the db...');
                        });

                        db.collection('telegram').update(details, updatedObj, (err, results) => {
                            err ? res.send({ 'error': 'An error has occurred' }) : console.log('UpdateId updated...');
                        });
                        
                        axios.post(`${baseUrl}${botApiToken}/sendMessage`,{
                            chat_id: chatIdFromResponse,
                            text: 'configured'
                        })
                        .then(response => {
                            console.log('Message posted!');
                            res.end(chatIdFromResponse);
                        })
                        .catch(err => {
                            console.log('Error -- b');
                            res.end('Error');
                        });
                    } else {
                        res.end('No new message');
                    }
                })
                .catch(err => {
                    console.log('Error -- c');
                    res.end('Error');
                });
            }
        });        
    });

    app.get('/getUsers', (req, res) => {
        db.collection('users').find({}).toArray((err, items) => {
            if(err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(items);
            }
        });
    });

};