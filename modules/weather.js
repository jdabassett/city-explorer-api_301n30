
'use strict';

require('dotenv').config();
const axios = require('axios');
const WEATHERKEY_TOKEN = process.env.WEATHERKEY;
const {Forecast} = require('./class.js');



async function weatherRequest(req,res,next){
  const {lat,lon} = req.query;
  let weatherQuery = {
    url:`http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERKEY_TOKEN}&lat=${lat}&lon=${lon}`,
    method:'GET'};

  try {

    // let weatherResponse = require('./data/seattle_weather.json');
    let weatherResponse = await axios(weatherQuery);

    // generate forecast object
    let forecastObject = new Forecast(weatherResponse);
    let forecastArray = forecastObject.getItems();
    return res.status(200).send(forecastArray);
    // return res.status(404).json({message:'not found'});

  } catch (error){
    next(error);
  }
}


module.exports = weatherRequest;
