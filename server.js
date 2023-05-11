
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');


//import global variables
const port = process.env.PORT || 3001;
const SERVER = process.env.SERVER;
const WEATHERKEY_TOKEN = process.env.WEATHERKEY;
const TMDBKEY_TOKEN = process.env.TMDBKEY;

//set up server
const app = express();

//configure what data format serve with except and send
app.use(express.json());
app.use(cors({origin: '*'}));

// class to generate forecast array
// input city object with forecast data
// run getItem() method to return array of formated forecasts
class Forecast {
  constructor(cityObject) {
    if (typeof cityObject !== 'object') throw new Error('List type error');
    this.cityObject = cityObject || {};
    this.forecastArray = cityObject.data.data || [];
    this.weekdayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
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


// get weather router
app.get('/weather', async (req,res,next)=>{
  const {lat,lon} = req.query;
  let weatherQuery = {
    url:`http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERKEY_TOKEN}&lat=${lat}&lon=${lon}`,
    method:'GET'};

  try {

    // let weatherResponse = require('./data/seattle_weather.json');
    let weatherResponse = await axios(weatherQuery);
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

// class to formate movie
// input movie object
// run getItem() method to formated movie
class MoviesFormated {
  constructor(movies) {
    if (typeof movies !== 'object') throw new Error('List type error');
    this.moviesArray = movies.data.results.sort((a,b)=>b.popularity-a.popularity) || [];
  }

  getItems() {
    // console.log('+++++++++++++++++++++++++++++', this.moviesArray);
    return this.moviesArray.map(item => ({
      title:item.title,
      overview:item.overview,
      average_votes:item.vote_average,
      total_votes:item.vote_count,
      image_url:`https://image.tmdb.org/t/p/w500/${item.poster_path}`,
      popularity:item.popularity,
      released_on:item.release_date,
    }));
  }
}

app.get('/movies', async (req,res,next)=>{
  const searchQuery = req.query.searchQuery;

  let moviesQuery = {
    url:`https://api.themoviedb.org/3/search/movie?api_key=${TMDBKEY_TOKEN}&query=${searchQuery}`,
    method:'GET'};

  try {

    // let moviesResponse = require('./data/seattle_movies.json');
    let moviesResponse = await axios(moviesQuery );
    // console.log(moviesResponse.data);

    // generate array of movie objects
    let moviesObject = new MoviesFormated(moviesResponse);
    let moviesArray = moviesObject.getItems().slice(0,20);

    //return get request of forecast array
    return res.status(200).send(moviesArray);

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
  res.status(404).json({message:error.message});
});


app.listen(port, ()=>(console.log(`Listen on the port ${port}...`)));



