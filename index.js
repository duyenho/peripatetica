import fs from 'fs'
import csv from 'csv-parser'
// import { Client } from '@googlemaps/google-maps-services-js'

// const client = new Client({})

fs.createReadStream('data/liam.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row)
  })
  .on('end', () => {
    console.log('CSV file successfully processed')
  });

console.log('Fin');


// client
//   .geocode({
//     params: {
//       address: "London",
//       key: process.env.GOOGLE_MAPS_API_KEY
//     },
//     timeout: 1000
//   })
//   .then(r => {
//     console.log(r.data.results[0]);
//   })
//   .catch(e => {
//     console.log(e);
//   });
  