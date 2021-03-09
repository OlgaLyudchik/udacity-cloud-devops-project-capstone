const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const app = express();
const port = process.env.PORT;
const apiKey = process.env.API_KEY;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('pages/index', { weather: null, error: null });
});

app.post('/', function (req, res) {
    const city = req.body.city;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            res.render('pages/index', { weather: null, error: 'Error, please try again' });
        } else {
            const weather = JSON.parse(body);
            if (weather.main === undefined) {
                res.render('pages/index', { weather: null, error: 'Error, please try again' });
            } else {
                const weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                res.render('pages/index', { weather: weatherText, error: null });
            }
        }
    });
});

app.listen(port, function () {
    console.log(`Weather application is listening on port ${port}...`);
})
