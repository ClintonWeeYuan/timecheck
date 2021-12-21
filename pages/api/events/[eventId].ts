import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db";
import {
  GetItemCommand,
  GetItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
} from "@aws-sdk/client-dynamodb";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (typeof req.query.eventId === "string") {
      const params: GetItemCommandInput = {
        TableName: "events",
        Key: {
          eventId: { S: req.query.eventId },
        },
        ProjectionExpression: "startTime, endTime, eventName, eventId, alert",
      };

      try {
        const Item = await db.send(new GetItemCommand(params));

        res.send(Item.Item);
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    }
  } else if (req.method === "PUT") {
    const { eventId, eventName, startTime, endTime, alert } = JSON.parse(
      req.body
    );

    if (req.query.eventId && eventId !== req.query.eventId) {
      res.send("Invalid id");
      res.status(404);
    } else if (alert) {
      const params = {
        TableName: "events",
        Key: {
          eventId: { S: eventId },
        },
        UpdateExpression: "set alert = :a",
        ExpressionAttributeValues: {
          ":a": { S: alert },
        },
        ReturnValues: "ALL_NEW",
      };
      try {
        const Item: UpdateItemCommandOutput = await db.send(
          new UpdateItemCommand(params)
        );
        res.send(Item.Attributes ? Item.Attributes.eventId.S : {});
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    } else {
      const params = {
        TableName: "events",
        Key: {
          eventId: { S: eventId },
        },
        UpdateExpression: "set eventName = :n, startTime = :s, endTime = :e",
        ExpressionAttributeValues: {
          ":n": { S: eventName },
          ":s": { N: startTime },
          ":e": { N: endTime },
        },
        ReturnValues: "ALL_NEW",
      };

      try {
        const Item: UpdateItemCommandOutput = await db.send(
          new UpdateItemCommand(params)
        );
        res.send(Item.Attributes ? Item.Attributes.eventId.S : {});
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    }
  } else if (req.method === "DELETE") {
    const { eventId, alert } = JSON.parse(req.body);
    const params = {
      TableName: "events",
      Action: "DELETE",
      Key: {
        eventId: { S: eventId },
      },
      UpdateExpression: "remove alert",
      ReturnValues: "ALL_NEW",
    };
    try {
      const Item: UpdateItemCommandOutput = await db.send(
        new UpdateItemCommand(params)
      );
      res.send(Item.Attributes ? Item.Attributes.eventId.S : {});
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
    }
  }
  return res;
}
