'use strict';

require('dotenv').config();
const axios = require('axios');
const data = require('../data/seattle_businesses.json');
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
        // console.log('movies-',cache[key].timestamp);
        res.status(200).send(businessesArray);
      })
      .catch(error => next(error));
  }

  // let businessesQuery = {
  //   url:`https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=20&latitude=${lat}&longitude=${lon}`,
  //   method:'GET',
  //   headers:{
  //     Authorization:YELPKEY_TOKEN
  //   }
  // };
  // axios(businessesQuery)
  //   .then(res => console.log(res))
  //   .catch(err => next(err));

  // let returnData = new BusinessesFormated(data).getItems();
  // res.status(200).json(returnData);
  
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
