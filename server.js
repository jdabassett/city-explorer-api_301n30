
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRequest = require('./modules/weather.js');
const moviesRequest = require('./modules/movies.js');
const errorHandler = require('./modules/error.js');
const businessesRequest = require('./modules/businesses.js');

//import global variables
const port = process.env.PORT || 3001;

//set up server
const app = express();

//configure what data format serve with except and send
app.use(express.json());
app.use(cors({origin: '*'}));

// get weather router
app.get('/weather', weatherRequest);

// get movies router
app.get('/movies', moviesRequest);

// get businesses router
app.get('/businesses', businessesRequest);

// first error router
app.get('*', errorHandler);

// last error router
app.use((err, req, res)=>{
  res.status(500).json({message:'record not found in database'});
});

app.listen(port, ()=>(console.log(`Listen on the port ${port}...`)));



