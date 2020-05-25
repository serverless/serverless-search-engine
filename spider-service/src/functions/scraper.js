'use strict';
const cheerio = require('cheerio')
const axios = require('axios')
const AWS = require('aws-sdk')

module.exports.scraper = async event => {
  if (!Array.isArray(event.Records) ||
    event.Records.length <= 0) {
    console.log('Event object is not an array')
    return new Error('Event object is not an array')
  }
  const url = JSON.parse(event.Records[0].Sns.Message).url
  const page = await axios(url)

  try {
    const $ = await cheerio.load(page.data)
    const links = $('a')
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    try {
      const linkPromises = links.map(function (link) {
        console.log('link', link)
        console.log('$(this).attr(\'href\').toString()', $(this).attr('href').toString())
        const putParam = {
          TableName: process.env.DYNAMODB_URLS_TABLE,
          Item: {
            url: $(this).attr('href').toString()
          }
        }
        return dynamodb.put(putParam).promise()
      })
      await Promise.all(linkPromises)
    } catch (putError) {
      console.log('putError', putError)
      return putError
    }

    const heading1  = $('h1')
    const headingText = Object.values(await heading1.map(function(heading) {
      return $(this).text()
    }))


  } catch (pageLoadError) {
    console.log('There was a problem loading the page')
    console.log('pageLoadError', pageLoadError)
  }
  return true
};
