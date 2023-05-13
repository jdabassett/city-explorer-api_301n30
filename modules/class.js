
'use strict';

class Forecast {
  constructor(cityObject) {
    if (typeof cityObject !== 'object') throw new Error('List type error');
    this.cityObject = cityObject || {};
    this.forecastArray = cityObject.data.data || [];
    this.weekdayArray = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    this.monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  }
  //change the format of the day
  formateDay (dateStr) {
    let dateObject = new Date(dateStr);
    let weekday = this.weekdayArray[dateObject.getDay()];
    let monthDay = dateObject.getDate();
    let month = this.monthArray[dateObject.getMonth()];
    return `${weekday}, ${month} ${monthDay}`;
  }

  //convert celsius to fahrenheit
  convertCtF (celsius) {
    let fahrenheit = Math.round((parseFloat(celsius)*(9/5))+32);
    return fahrenheit;
  }

  // method to return forecast array
  getItems() {
    return this.forecastArray.map(item => ({
      name: this.formateDay(item.datetime),
      description_C: `Low of ${Math.round(item.low_temp)}°C, 
                      high of ${Math.round(item.high_temp)}°C
                      with ${item.weather.description.toLowerCase()}`,
      description_F: `Low of ${this.convertCtF(item.low_temp)}°F,
                      high of ${this.convertCtF(item.high_temp)}°F
                      with ${item.weather.description.toLowerCase()}`
    }));
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


module.exports = {
  MoviesFormated: MoviesFormated,
  Forecast: Forecast
};
