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

  axios(moviesQuery)
    .then(res => new MoviesFormated(res))
    .then(moviesObject => moviesObject.getItems().slice(0,20))
    // .then(moviesArray => res.status(404).json({message:'movies error'}))
    .then(moviesArray => res.status(200).send(moviesArray))
    .catch(error => next(error));
  
  // old way of doing it
  // try {
  //   let moviesResponse = await axios(moviesQuery );
  //   let moviesObject = new MoviesFormated(moviesResponse);
  //   let moviesArray = moviesObject.getItems().slice(0,20);
  //   return res.status(200).send(moviesArray);
  // } catch (error){
  //   next(error);
  // }
}

module.exports = moviesRequest;
