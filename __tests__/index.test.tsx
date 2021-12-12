import { GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import db from "../db";

import { createMocks } from "node-mocks-http";

import handleRequest from "../pages/api/events/[eventId]";
const dynamoDBMock = mockClient(db);
describe("Updating and Receiving event data from DynamoDB", () => {
  test("Update Event", async () => {
    dynamoDBMock
      .on(UpdateItemCommand, {
        TableName: "events",
        Key: {
          eventId: { S: "123" },
        },
        UpdateExpression: "set eventName = :n, startTime = :s, endTime = :e",
        ExpressionAttributeValues: {
          ":n": { S: "Test Put" },
          ":s": { N: "12345" },
          ":e": { N: "12345" },
        },
        ReturnValues: "ALL_NEW",
      })
      .resolves({
        Attributes: {
          eventId: { S: "123" },
        },
      });

    const { req, res } = createMocks({
      method: "PUT",
      body: JSON.stringify({
        eventId: "123",
        eventName: "Test Put",
        startTime: "12345",
        endTime: "12345",
      }),
    });
    await handleRequest(req, res);

    expect(res.statusCode).toStrictEqual(200);
    expect(res._getData()).toStrictEqual("123");
  });
  test("Get Event", async () => {
    dynamoDBMock
      .on(GetItemCommand, {
        TableName: "events",
        Key: {
          eventId: { S: "123" },
        },
        ProjectionExpression: "startTime, endTime, eventName",
      })
      .resolves({
        Item: {
          eventId: { S: "123" },
          eventName: { S: "Test Get" },
          startTime: { N: "12345" },
          endTime: { N: "12345" },
        },
      });
    const { req, res } = createMocks({
      method: "GET",
      query: {
        eventId: "123",
      },
    });
    await handleRequest(req, res);

    expect(res.statusCode).toStrictEqual(200);
    expect(res._getData().eventId.S).toStrictEqual("123");
    expect(res._getData().eventName.S).toStrictEqual("Test Get");
    expect(res._getData().startTime.N).toStrictEqual("12345");
    expect(res._getData().endTime.N).toStrictEqual("12345");
  });
});
