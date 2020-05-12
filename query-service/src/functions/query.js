'use strict';
const AWS = require('aws-sdk')

module.exports.query = async event => {
  const body = JSON.parse(event.body)
  const keywords = body.search
  const keywordsArr = keywords.split(' ')
  const secondaryKey = keywordsArr[1] + '|' + keywordsArr[2]

  const queryParams = {
    TableName: process.env.DYNAMODB_KEYWORD_TABLE,
    KeyConditionExpression: '#HashKey = :hkey and #RangeKey = :rkey',
    ExpressionAttributeValues: {
      ':hkey': keywordsArr[0],
      ':rkey': secondaryKey
    },
    ExpressionAttributeNames: {
      '#HashKey': 'pk',
      '#RangeKey': 'sk'
    }
  }
  let response = {}
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const queryResult = await dynamodb.query(queryParams).promise()
    console.log('queryParams', queryParams)
    console.log('queryResult', queryResult)
    response = queryResult.Items.map(resultItem => {
      return resultItem.url
    })
  } catch (queryError) {
    console.log('There was an error querying the database')
    console.log('queryError', queryError)
    console.log('queryParams', queryParams)
    return new Error('There was an error querying the database')
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      response
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
