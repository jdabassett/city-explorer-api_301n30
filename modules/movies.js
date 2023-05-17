'use strict';

require('dotenv').config();
const axios = require('axios');
const TMDBKEY_TOKEN = process.env.TMDBKEY;
const cache = require('./cache.js');


async function moviesRequest (req,res,next) {
  const searchQuery = req.query.searchQuery;
  let key = `movies?searchQuery=${searchQuery}`;

  let moviesQuery = {
    url:`https://api.themoviedb.org/3/search/movie?api_key=${TMDBKEY_TOKEN}&query=${searchQuery}`,
    method:'GET'};

  if (cache[key] && (Date.now()-cache[key].timestamp<10000000)){
    console.log('found in cache');
    res.status(200).send(cache[key].data);
  } else {
    axios(moviesQuery)
      .then(res => new MoviesFormated(res))
      .then(moviesObject => moviesObject.getItems().slice(0,20))
      // .then(moviesArray => res.status(404).json({message:'movies error'}))
      .then(moviesArray => {
        cache[key] = {};
        cache[key].timestamp = Date.now();
        cache[key].data = moviesArray;
        // console.log('movies-',cache[key].timestamp);
        res.status(200).send(moviesArray);
      })
      .catch(error => next(error));
  }
}

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

module.exports = moviesRequest;
