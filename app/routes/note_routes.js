let ObjectID = require('mongodb').ObjectID;
const baseUrl = 'https://api.telegram.org/bot';
const botApiToken = '483461591:AAGG0iNPgfQyEWJbf6glcuF1yBtyOjSD6ZA';
const axios = require('axios');
let path = require('path');
let updateId;
let newUpdateNumber;
let updateIdObjectPrimaryKey;

module.exports = function(app, db) {
    // app.post('/new-message', (req, res) => {
    //     const {message} = req.body;
    
    //     if(!message  || message.text.toLowerCase().indexOf('configure') < 0) {
    //         return res.end();
    //     }
    //     axios.post(`${baseUrl}${botApiToken}/sendMessage`, {
    //         chat_id: message.chat.id,
    //         text: 'Your account has been configured.'
    //     })
    //     .then(response => {
    //         console.log('Message posted!');
    //         res.end('OK');
    //     })
    //     .catch(err => {
    //         console.log('Error:', err);
    //         res.end('Error:', err);
    //     });
    // });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../index.html'));
    });

    app.get('/getUpdates', (req, res) => {        
        db.collection('telegram').find({}).toArray((err, items) => {
            if(err) {
                res.send({ 'error': 'An error has occurred' });
            } else {                
                // console.log(items);
                updateId = items[0].updateId;

                let url = `${baseUrl}${botApiToken}/getUpdates?offset=${updateId}`;
                // console.log(url);
                axios.get(url)
                .then(response => {
                    if(response.data.result[0] !== undefined) {
                        newUpdateNumber = parseInt(updateId) + 1;
                        let details = { '_id': new ObjectID(items[0]._id) };
                        let updatedObj = { updateId: newUpdateNumber };

                        db.collection('telegram').update(details, updatedObj, (err, results) => {
                            if(err) {
                                res.send({ 'error': 'An error has occurred' });
                            } else {
                                //res.send(updatedObj);
                                console.log('UpdateId updated...');
                            }
                        });
                        // res.end(response.data.result[0].message.chat.id);
                        res.end(response.data.result[0].message.chat.id.toString());
                    } else {
                        res.end('No new message');
                    }
                })
                .catch(err => {
                    console.log('Error:', err);
                    res.end('Error:', err);
                });
            }
        });        
    });

    

    // app.get('/telegram', (req, res) => {
    //     // const id = req.params.id;
    //     // const details = { '_id': new ObjectID(id) };
    //     db.collection('telegram').find({}).toArray((err, items) => {
    //         if(err) {
    //             res.send({ 'error': 'An error has occurred' });
    //         } else {
    //             // res.send(item);
    //             console.log(items);
    //             res.end('OK');
    //         }
    //     });
    // });
    
};