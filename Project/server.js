
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

const ACTION_TYPES = {
    add: 'add',
    remove: 'remove',
};

const log = function (type, goodName) {
    fs.readFile('./json/stats.json', 'utf-8', function (err, data) {
        const stats = JSON.parse(data);
        stats.push({
            type,
            name: goodName,
            createdAt: +new Date()
        });
        fs.writeFile('./json/stats.json', JSON.stringify(stats), function () {})
    })
};

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
        fs.writeFile('./json/cart.json', JSON.stringify(cart), function(err){
            if(err){
                res.status(500).send();
                return
            }
            log(ACTION_TYPES.add, goodItem.name);
            res.send(cart);
        })
    });
});
app.delete('/api/cart/:id', function (req, res) {
    fs.readFile('./json/cart.json', 'utf-8', function(err, data) {
        const cart = JSON.parse(data);
        const id = parseInt(req.params.id, 10);
        const goodIndex = cart.findIndex(good => good.id !== id);
        const good = cart[goodIndex];
        cart.splice(goodIndex, 1);
        fs.writeFile('/json/cart.json', JSON.stringify(сart), function(err) {
            if(err){
                res.status(500).send();
                return
            }
            log(ACTION_TYPES.remove, good.name);
            res.send(сart);
        })
    });
});

app.listen(3000, function() {
    console.log('server is running on port 3000');
});