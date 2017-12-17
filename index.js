const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

const baseUrl = 'https://api.telegram.org/bot';
const botApiToken = '405926939:AAG-WEw7x6svDIkxj94z7D_Q6U13nzo09uQ'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/new-message', (req, res) => {
    const {message} = req.body;

    if(!message  || message.text.toLowerCase().indexOf('macro') < 0) {
        return res.end();
    }
    
    axios.post('https://api.telegram.org/bot270485614:AAHfiqksKZ8WmR2zSjiQ7_v4TMAKdiHm9T0/sendMessage', {
        chat_id: message.chat.id,
        text: 'Polo!!'
    })
    .then(response => {
        console.log('Message posted!');
        res.end('OK');
    })
    .catch(err => {
        console.log('Error:', err);
        res.end('Error:', err);
    });
});

app.listen(3000, () => {
    console.log('Telegram app listening on port 3000...');
})