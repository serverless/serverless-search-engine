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
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const queryResult = await dynamodb.query(queryParams).promise()
    console.log('queryParams', queryParams)
    console.log('queryResult', queryResult)
    const items = []
    for (const itemResult of queryResult.Items) {
      console.log(itemResult)
      items.push(itemResult.url)
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: items
      }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (queryError) {
    console.log('There was an error querying the database')
    console.log('queryError', queryError)
    console.log('queryParams', queryParams)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'There was an error querying the database'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
};
