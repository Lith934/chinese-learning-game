import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { User, APIResponse } from '../types';

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

export const createUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' });
    }

    const userData = JSON.parse(event.body);
    
    const user: User = {
      id: uuidv4(),
      name: userData.name || 'Anonymous User',
      email: userData.email || '',
      avatar: userData.avatar,
      level: 1,
      experience: 0,
      totalScore: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: process.env.USERS_TABLE!,
      Item: user,
    }));

    return createResponse(201, { user });
  } catch (error) {
    console.error('Error creating user:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.id;
    
    if (!userId) {
      return createResponse(400, { error: 'User ID is required' });
    }

    const result = await docClient.send(new GetCommand({
      TableName: process.env.USERS_TABLE!,
      Key: { id: userId },
    }));

    if (!result.Item) {
      return createResponse(404, { error: 'User not found' });
    }

    return createResponse(200, { user: result.Item });
  } catch (error) {
    console.error('Error getting user:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.id;
    
    if (!userId) {
      return createResponse(400, { error: 'User ID is required' });
    }

    if (!event.body) {
      return createResponse(400, { error: 'Request body is required' });
    }

    const updates = JSON.parse(event.body);
    
    // Build update expression
    const updateExpressions: string[] = [];
    const expressionAttributeNames: any = {};
    const expressionAttributeValues: any = {};
    
    if (updates.experience !== undefined) {
      updateExpressions.push('#experience = :experience');
      expressionAttributeNames['#experience'] = 'experience';
      expressionAttributeValues[':experience'] = updates.experience;
    }
    
    if (updates.level !== undefined) {
      updateExpressions.push('#level = :level');
      expressionAttributeNames['#level'] = 'level';
      expressionAttributeValues[':level'] = updates.level;
    }
    
    if (updates.totalScore !== undefined) {
      updateExpressions.push('#totalScore = :totalScore');
      expressionAttributeNames['#totalScore'] = 'totalScore';
      expressionAttributeValues[':totalScore'] = updates.totalScore;
    }

    // Always update lastLoginAt
    updateExpressions.push('#lastLoginAt = :lastLoginAt');
    expressionAttributeNames['#lastLoginAt'] = 'lastLoginAt';
    expressionAttributeValues[':lastLoginAt'] = new Date().toISOString();

    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.USERS_TABLE!,
      Key: { id: userId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));

    return createResponse(200, { user: result.Attributes });
  } catch (error) {
    console.error('Error updating user:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};