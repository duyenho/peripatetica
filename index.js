import fs from 'fs'
import csv from 'csv-parser'
import { Client } from '@googlemaps/google-maps-services-js'

function writeToCSVFile(cities) {
  const filename = 'data/liam_geocodes.csv'

  fs.writeFile(filename, extractAsCSV(cities), err => {
    if (err) {
      console.log('Error writing to CSV file', err)
    } else {
      console.log(`Saved as ${filename}`)
    }
  })
}

function extractAsCSV(cities) {
  const header = ['city,date,duration,latitude,longitude'];
  const rows = cities.map(city =>
    `${city.city},${city.date},${city.duration},${city.latitude},${city.longitude}`
  )
  return header.concat(rows).join('\n')
}

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
        writeToCSVFile(cities)
      })
      .catch(e => {
        console.log(e);
      });
  })
  .on('end', () => {
    console.log('Fin');
  });
