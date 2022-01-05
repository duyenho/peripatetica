import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

client
  .geocode({
    params: {
      address: "London",
      key: process.env.GOOGLE_MAPS_API_KEY
    },
    timeout: 1000
  })
  .then(r => {
    console.log(r.data.results[0]);
  })
  .catch(e => {
    console.log(e);
  });
  