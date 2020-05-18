'use strict';
const cheerio = require('cheerio')
const axios = require('axios')
module.exports.scraper = async event => {
  console.log(event)
  console.log('typeof(event.Records)', typeof(event.Records))
  if (!Array.isArray(event.Records) ||
    event.Records.length <= 0) {
    return new Error('Event object is not an array')
  }
  const url = JSON.parse(event.Records[0].Sns.Message).url
  const page = await axios(url)
  console.log('page', page)
  const $ = await cheerio.load(page)
  const links = $('a')
  console.log('links', links)
  return true
};
