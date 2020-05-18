'use strict'
const AWS = require('aws-sdk')
module.exports.startScraping = async event => {
  const sns = new AWS.SNS()
  const messageParams = {
    TopicArn: process.env.SNS_SCRAPE_PAGE_TOPIC,
    Message: JSON.stringify({
      url: 'http://serverless.com'
    })
  }
  try {
    const result = await sns.publish(messageParams).promise()
    console.log('result', result)
    return true
  } catch(snsError) {
    console.log('There was an error using SNS')
    console.log('snsError', snsError)
    console.log('messageParams', messageParams)
    return snsError
  }
}
