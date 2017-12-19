let ObjectID = require('mongodb').ObjectID;
const baseUrl = 'https://api.telegram.org/bot';
const botApiToken = '483461591:AAGG0iNPgfQyEWJbf6glcuF1yBtyOjSD6ZA'

module.exports = function(app, db) {
    app.post('/new-message', (req, res) => {
        const {message} = req.body;
    
        if(!message  || message.text.toLowerCase().indexOf('configure') < 0) {
            return res.end();
        }
    
        axios.post(`${baseUrl}${botApiToken}/sendMessage`, {
            chat_id: message.chat.id,
            text: 'Your account has been configured.'
        })
        .then(response => {
            console.log('Message posted!');
            res.end('OK');
        })
        .catch(err => {
            console.log('Error:', err);
            res.end('Error:', err);
        });
    
        // chatId = message.chat.id;
    });
    
};