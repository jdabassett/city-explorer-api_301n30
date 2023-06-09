'use strict';

require('dotenv').config();
const axios = require('axios');
// const data = require('../data/seattle_businesses.json');
const cache = require('./cache.js');

const YELPKEY_TOKEN = process.env.YELPKEY;


function businessesRequest(req,res,next){
  const {searchQuery} = req.query;
  let key = `businesses?searchQuery=${searchQuery}`;

  let config = {headers:{'Authorization':`Bearer ${YELPKEY_TOKEN}`}};
  // console.log(headers);
  let url = `https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=20&location=${searchQuery}`;
  // console.log(url);
  if (cache[key] && (Date.now()-cache[key].timestamp<100000000)){
    console.log('businesses- found in cache')
    res.status(200).send(cache[key].data);
  } else {
    // console.log('made new axios request');
    axios.get(url,config)
      .then(res => new BusinessesFormated(res.data))
      .then(businessesObject => businessesObject.getItems())
      // .then(moviesArray => res.status(404).json({message:'movies error'}))
      .then(businessesArray => {
        cache[key] = {};
        cache[key].timestamp = Date.now();
        cache[key].data = businessesArray;
        console.log('businesses-',cache[key].timestamp);
        res.status(200).send(businessesArray);
      })
      .catch(error => next(error));
  }  
}

class BusinessesFormated {
  constructor(apiResponse) {
    this.businesses = apiResponse.businesses;
  }
  getItems() {
    return this.businesses.map(business => ({
      name:business.name,
      image_url:business.image_url,
      url:business.url,
      review_count:business.review_count,
      rating:business.rating,
      price:business.price,
      location:business.location.display_address,
      phone:business.phone,
      display_phone:business.display_phone
    }));
  }
}




module.exports = businessesRequest;
