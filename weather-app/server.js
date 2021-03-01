const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var path = require('path');
const app = express()
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('pages/index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('pages/index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('pages/index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('pages/index', {weather: weatherText, error: null});
      }
    }
  });
})

app.listen(port, function () {
  console.log(`Weather application is listening on port ${port}...`)
})