
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRequest = require('./modules/weather.js');
const moviesRequest = require('./modules/movies.js');

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


// syntax error
app.get('*', (req, res) => {
  res.status(404).json({message:'not found'});
});


// error router
app.use((error, req, res) => {
  res.status(404).json({message:error.message});
});


app.listen(port, ()=>(console.log(`Listen on the port ${port}...`)));



