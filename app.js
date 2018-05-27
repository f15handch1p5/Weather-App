const yargs = require('yargs');
const axios = require('axios');

const argv = yargs.options ({
  a: {
    demand: false,
    alias: 'address',
    describe: 'Address to fetch weather for',
    string: true
  },
  dl: {
    demand: false,
    alias: 'defaultLocation',
    describe: 'Set a default location to fetch the weather for',
    string: true
  }
})
.help()
.alias('help', 'h')
.argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyAapMF2mNE3Hh82O45oL1D0AaAqAgt1No8`

axios.get(geocodeUrl).then((response) => {
  if (response.data.status === 'ZERO_RESULTS') {
    throw new Error('Unable to find that address.');
  }

  var latitude = response.data.results[0].geometry.location.lat;
  var longitude = response.data.results[0].geometry.location.lng;
  var weatherUrl = `https://api.forecast.io/forecast/d345934cda9f571fa4749d7b8b213845/${latitude},${longitude}`
  console.log(response.data.results[0].formatted_address);

  return axios.get(weatherUrl);
}).then((response) => {
  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`)
}).catch((error) => {
  if (error.code === 'ENOTFOUND') {
    console.log('Unable to connect to API servers.');
  } else {
    console.log(error.message);
  }
});
