
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const data = require('./data/weather.json');
const port = process.env.PORT || 3001;

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
    this.forecastArray = cityObject.data || null;
  }
  // method to return forecast array
  getItems() {
    return this.forecastArray.map(item => ({
      name: item.datetime,
      description: `Low of ${item.low_temp}, high of ${item.high_temp} with ${item.weather.description.toLowerCase()}`
    }));
  }
}


// get weather router
app.get('/weather', async (req,res)=>{
  const searchQuery  = `${req.query.searchQuery}`.toLowerCase();

  try {
    let record = await data.find(item =>item.city_name.toLowerCase()===searchQuery);

    if (record === null || record===undefined){
      return res.status(404).json({message:'Couldn\'t find record'});
    }
    // generate forecast object
    let forecastObject = new Forecast(record);
    let forecastArray = forecastObject.getItems();
    //return get request of forecast array
    return res.status(200).json({data:forecastArray});

  } catch (error){
    return res.status(405).json({message:error.message});
  };
});


// syntax error
app.get('*', (req, res) => {
  res.status(404).send('not found');
});


// error router
app.use((error, req, res) => {
  console.error(error);
  res.status(500).json({message:error.message});
});


app.listen(port, ()=>(console.log(`Listen on the port ${port}...`)));



