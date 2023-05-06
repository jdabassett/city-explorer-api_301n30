const express = require('express');
const router = express.Router();
const data = require('../data/weather.json');


router.get('/', async (req,res)=>{
  // const lat = req.query.lat;
  // console.log(lat);
  // const lon = req.query.lon;
  // console.log(lon);
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




module.exports = router;
