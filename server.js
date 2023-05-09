
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');


//import global variables
const port = process.env.PORT || 3001;
const SERVER = process.env.SERVER;
const WEATHERKEY_TOKEN = process.env.WEATHERKEY;

//set up server
const app = express();

//configure what data format serve with except and send
app.use(express.json());
app.use(cors({origin: '*'}));

// class to generate forecast array
// input city object with forecast data
// run getItem() method to return array of formated forecast results
class Forecast {
  constructor(cityObject) {
    if (typeof cityObject !== 'object') throw new Error('List type error');
    this.cityObject = cityObject || {};
    this.forecastArray = cityObject.data || [];
    this.weekdayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    this.monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  }
  //change the format of the day
  formateDay (dateStr) {
    let dateObject = new Date(dateStr);
    let weekday = this.weekdayArray[dateObject.getDay()];
    let monthDay = dateObject.getDate();
    let month = this.monthArray[dateObject.getMonth()];
    // let following = 
    //   if(monthDay===1){return 'st'};
    //   else if(monthDay===2){return 'nd'};
    //   else if(monthDay===3){return 'st'};
    //   else {return 'th'};
    // };

    return `${weekday}, ${month} ${monthDay}`;
  }

  //convert celsius to fahrenheit
  convertCtF (celsius) {
    let fahrenheit = Math.round((parseFloat(celsius)*(9/5))+32);
    return fahrenheit;
  }




  // method to return forecast array
  getItems() {
    // console.log('+++++++++++++++++++++++++++++', this.forecastArray);
    return this.forecastArray.map(item => ({
      name: this.formateDay(item.datetime),
      description_C: `Low of ${Math.round(item.low_temp)}°C, high of ${Math.round(item.high_temp)}°C with ${item.weather.description.toLowerCase()}`,
      description_F: `Low of ${this.convertCtF(item.low_temp)}°F, high of ${this.convertCtF(item.high_temp)}°F with ${item.weather.description.toLowerCase()}`
    }));
  }
}

// http://api.weatherbit.io/v2.0/forecast/daily?key=7a4a564fd2ba43eaa78e02ace133c6d6&lat=47.6038321&lon=-122.330062
// get weather router
app.get('/weather', async (req,res,next)=>{
  const {lat,lon} = req.query;
  let weatherQuery = {
    url:`http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERKEY_TOKEN}&lat=${lat}&lon=${lon}`,
    method:'GET'};

  try {

    let weatherResponse = require('./data/seattle_weather.json');
    // let weatherResponse = await axios(weatherQuery);
    // console.log(weatherResponse);

  
    // generate forecast object
    let forecastObject = new Forecast(weatherResponse);
    let forecastArray = forecastObject.getItems();
    //return get request of forecast array
    return res.status(200).send(forecastArray);

  } catch (error){
    // throw new Error('List type error');
    next(error);
    // return res.status(404).json({message:error.message});
  }
});


// syntax error
app.get('*', (req, res) => {
  res.status(404).json({message:'not found'});
});


// error router
app.use((error, req, res) => {
  res.status(500).json({message:error.message});
});


app.listen(port, ()=>(console.log(`Listen on the port ${port}...`)));



