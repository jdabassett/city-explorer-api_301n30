
'use strict';

require('dotenv').config();
const axios = require('axios');
const WEATHERKEY_TOKEN = process.env.WEATHERKEY;
const {Forecast} = require('./class.js');



function weatherRequest(req,res,next){
  const {lat,lon} = req.query;
  let weatherQuery = {
    url:`http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERKEY_TOKEN}&lat=${lat}&lon=${lon}`,
    method:'GET'};

  axios(weatherQuery)
    .then(res => new Forecast(res))
    .then(forecastObject => forecastObject.getItems())
    .then(forecastArray => res.status(200).send(forecastArray))
    .catch(err => next(err));

  // old way of doing it
  // try {
  //   let weatherResponse = await axios(weatherQuery);
  //   let forecastObject = new Forecast(weatherResponse);
  //   let forecastArray = forecastObject.getItems();
  //   return res.status(200).send(forecastArray);
  // } catch (error){
  //   next(error);
  // }
}


module.exports = weatherRequest;
