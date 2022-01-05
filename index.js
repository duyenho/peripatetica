import fs from 'fs'
import csv from 'csv-parser'
import { Client } from '@googlemaps/google-maps-services-js'

const client = new Client({})
const cities = []

fs.createReadStream('data/liam.csv')
  .pipe(csv())
  .on('data', (row) => {
    client
      .geocode({
        params: {
          address: row.city,
          key: process.env.GOOGLE_MAPS_API_KEY
        },
      })
      .then(r => {
        const geocode = r.data.results[0].geometry.location
        const city = {
          city: row.city,
          date: row.date,
          duration: row.duration,
          latitude: geocode.lat,
          longitude: geocode.lng,
        }
        cities.push(city)
      })
      .catch(e => {
        console.log(e);
      });
  })
  .on('end', () => {
    console.log('CSV file successfully processed')
  });

console.log('Fin');
