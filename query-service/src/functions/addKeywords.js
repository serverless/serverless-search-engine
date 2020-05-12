'use strict'
const AWS = require('aws-sdk')

module.exports.addKeywords = async event => {
  const dynamodb = new AWS.DynamoDB.DocumentClient()
  console.log('event', event)
  await event.Records.forEach(record => {
    const message = JSON.parse(record.Sns.Message)
    const keywordsArr = message.keywords.split(' ')
    const secondaryKey = keywordsArr[1] + '|' + keywordsArr[2]
    const putParams = {
      TableName: process.env.DYNAMODB_KEYWORD_TABLE,
      Item: {
        'pk': keywordsArr[0],
        'sk': secondaryKey
      }
    }
    dynamodb.put(putParams).promise()
  })

  return true
  // {
  //   "keywords":"serverless framework awesome",
  //   "url": ["serverless.com"]
  // }


}
