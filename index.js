import fs from 'fs'
import csv from 'csv-parser'
import { Client } from '@googlemaps/google-maps-services-js'

function writeToCSVFile(cities) {
  const filename = 'data/liam_geocodes.csv'

  fs.writeFile(filename, extractAsCSV(cities), err => {
    if (err) {
      console.log('Error writing to CSV file', err)
    } else {
      console.log(`Saved in ${filename}`)
    }
  })
}

function extractAsCSV(cities) {
  const header = ['city,date,days,latitude,longitude']
  cities.sort((a,b) => a.date - b.date)
  const rows = cities.map(city =>
    `${city.city.trim()},${city.date},${city.duration},${city.latitude},${city.longitude}`
  )
  return header.concat(rows).join('\n')
}

function dateToUnixTimestamp(date) {
  const dayMonthYear = date.split('/')
  const formattedDate = `${dayMonthYear[2]}-${dayMonthYear[1]}-${dayMonthYear[0]} 00:00:00.000`
  return Math.floor(new Date(formattedDate).getTime()/1000)
}

function durationInDays(duration) {
  let days = 0
  const weeksDays = duration.split(' ')
  weeksDays.forEach(e => {
    if (e.indexOf('w') === 1) {
      days = days + parseFloat(e[0]) * 7
    }
    if (e.indexOf('d') === 1) {
      days = days + parseFloat(e[0])
    }
  })
  return days
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
          key: process.env.GOOGLE_MAPS_API_KEY_DEV
        },
      })
      .then(r => {
        const geocode = r.data.results[0].geometry.location
        const city = {
          city: row.city,
          date: dateToUnixTimestamp(row.date),
          duration: durationInDays(row.duration),
          latitude: geocode.lat,
          longitude: geocode.lng,
        }
        cities.push(city)
        writeToCSVFile(cities)
      })
      .catch(e => {
        console.log(e)
      });
    })
  .on('end', () => {
    console.log('Fin')
  })
  