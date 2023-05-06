
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

// class to generate object
class Forecast {
  constructor(cityObject) {
    if (typeof cityObject !== 'object') throw new Error('List type error');
    this.cityName = cityObject.city_name || null;
    this.forecast = cityObject.data || null;
  }

  // What are Items defined as on our App?  Just on object with name and description properties.
  getItems() {
    return this.forecast.map(item => ({
      name: this.cityName,
      description: `Low of ${item.low_temp}, high of${item.high_temp} with ${item.weather.description}`
    }));
  }
}


// get router
app.get('/', async (req,res)=>{
  // const lat = req.query.lat;
  // const lon = req.query.lon;
  const searchQuery  = `${req.query.searchQuery}`.toLowerCase();

  try {
    let record = await data.find(item =>item.city_name.toLowerCase()===searchQuery);

    if (record === null || record===undefined){
      return res.status(404).json({message:'Couldn\'t find record'});
    }
    return res.status(200).json(record);

  } catch (error){
    return res.status(404).json({message:error.message});
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



