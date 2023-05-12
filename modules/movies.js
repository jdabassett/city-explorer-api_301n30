'use strict';

require('dotenv').config();
const axios = require('axios');
const TMDBKEY_TOKEN = process.env.TMDBKEY;
const {MoviesFormated} = require('./class.js');



async function moviesRequest (req,res,next) {
  const searchQuery = req.query.searchQuery;

  let moviesQuery = {
    url:`https://api.themoviedb.org/3/search/movie?api_key=${TMDBKEY_TOKEN}&query=${searchQuery}`,
    method:'GET'};

  try {

    // let moviesResponse = require('./data/seattle_movies.json');
    let moviesResponse = await axios(moviesQuery );

    // generate array of movie objects
    let moviesObject = new MoviesFormated(moviesResponse);
    let moviesArray = moviesObject.getItems().slice(0,20);

    //return get request of forecast array
    return res.status(200).send(moviesArray);
    // return res.status(404).json({message:'not found'});

  } catch (error){
    next(error);
  }
}

module.exports = moviesRequest;
