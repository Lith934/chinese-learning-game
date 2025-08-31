import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { ChineseCharacter } from '../types';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body),
});

export const getCharacters = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const level = event.queryStringParameters?.level;
    const category = event.queryStringParameters?.category;
    
    let filterExpression = '';
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    
    if (level) {
      filterExpression = '#difficulty <= :level';
      expressionAttributeNames = { '#difficulty': 'difficulty' };
      expressionAttributeValues = { ':level': parseInt(level) };
    }
    
    if (category) {
      if (filterExpression) {
        filterExpression += ' AND #category = :category';
      } else {
        filterExpression = '#category = :category';
      }
      expressionAttributeNames = { ...expressionAttributeNames, '#category': 'category' };
      expressionAttributeValues = { ...expressionAttributeValues, ':category': category };
    }
    
    const params: any = {
      TableName: process.env.CHARACTERS_TABLE!,
    };
    
    if (filterExpression) {
      params.FilterExpression = filterExpression;
      params.ExpressionAttributeNames = expressionAttributeNames;
      params.ExpressionAttributeValues = expressionAttributeValues;
    }

    const result = await docClient.send(new ScanCommand(params));

    return createResponse(200, { 
      characters: result.Items || [],
      count: result.Count || 0 
    });
  } catch (error) {
    console.error('Error getting characters:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

export const getCharacter = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const characterId = event.pathParameters?.id;
    
    if (!characterId) {
      return createResponse(400, { error: 'Character ID is required' });
    }

    const result = await docClient.send(new GetCommand({
      TableName: process.env.CHARACTERS_TABLE!,
      Key: { id: characterId },
    }));

    if (!result.Item) {
      return createResponse(404, { error: 'Character not found' });
    }

    return createResponse(200, { character: result.Item });
  } catch (error) {
    console.error('Error getting character:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};