
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');


const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

app.get('/api/goods', function(req, res) {
    fs.readFile('./json/catalog.json', 'utf-8', function(err, data){
        res.send(data);
    });
});

app.post('/api/cart', function(req, res) {
    fs.readFile('./json/cart.json', 'utf-8', function(err, data){
        const cart = JSON.parse(data);
        const goodItem = req.body;

        cart.push(goodItem);
        fs.writeFile('./cart.json', JSON.stringify(cart), function(err){
            if(err){
                res.status(500).send();
                return
            }
            res.send(cart);
        })
    });
});

app.delete('/api/cart', function (req, res) {
    res.send();
});

app.listen(3000, function() {
    console.log('server is running on port 3000');
});