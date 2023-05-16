
'use strict';

require('dotenv').config();
const axios = require('axios');
const WEATHERKEY_TOKEN = process.env.WEATHERKEY;
const cache = require('./cache.js');


function weatherRequest(req,res,next){
  const {lat,lon} = req.query;
  let key = `weather?lat=${lat}&lon=${lon}`;
  let weatherQuery = {
    url:`http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERKEY_TOKEN}&lat=${lat}&lon=${lon}`,
    method:'GET'};

  if (cache[key] && (Date.now()-cache[key].timestamp)<10000000){
    // console.log('found cache');
    res.status(200).send(cache[key].data);
  } else{
    // console.log('requested new, added to cache');
    axios(weatherQuery)
      .then(res => new Forecast(res))
      .then(forecastObject => forecastObject.getItems())
      // .then(forecastArray => res.status(404).json({message:'movies error'}))
      .then(forecastArray => {
        // throw new Error('this is my testing error message');
        cache[key]={};
        cache[key].timestamp=Date.now();
        cache[key].data=forecastArray;
        console.log('weather-',cache[key].timestamp);
        res.status(200).send(forecastArray);
      })
      .catch(err => next(err));
  }
}


class Forecast {
  constructor(cityObject) {
    if (typeof cityObject !== 'object') throw new Error('List type error');
    this.cityObject = cityObject || {};
    this.forecastArray = cityObject.data.data || [];
    this.weekdayArray = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    this.monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  }
  //change the format of the day
  formateDay (dateStr) {
    let dateObject = new Date(dateStr);
    let weekday = this.weekdayArray[dateObject.getDay()];
    let monthDay = dateObject.getDate();
    let month = this.monthArray[dateObject.getMonth()];
    return `${weekday}, ${month} ${monthDay}`;
  }

  //convert celsius to fahrenheit
  convertCtF (celsius) {
    let fahrenheit = Math.round((parseFloat(celsius)*(9/5))+32);
    return fahrenheit;
  }

  // method to return forecast array
  getItems() {
    return this.forecastArray.map(item => ({
      name: this.formateDay(item.datetime),
      description_C: `Low of ${Math.round(item.low_temp)}°C, 
                      high of ${Math.round(item.high_temp)}°C
                      with ${item.weather.description.toLowerCase()}`,
      description_F: `Low of ${this.convertCtF(item.low_temp)}°F,
                      high of ${this.convertCtF(item.high_temp)}°F
                      with ${item.weather.description.toLowerCase()}`
    }));
  }
}


module.exports = weatherRequest;
