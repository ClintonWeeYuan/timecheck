import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db";
import {
  GetItemCommand,
  GetItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
const bcrypt = require("bcrypt");

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
        ProjectionExpression:
          "startTime, endTime, eventName, eventId, alert, password, clock, theme",
      };

      try {
        const Item = await db.send(new GetItemCommand(params));

        if (Item.Item && Item.Item.password) {
          Item.Item.password.S = "blank";
          res.statusCode = 200;
          res.send(Item.Item);
        } else {
          res.statusCode = 200;
          res.send(Item.Item);
        }
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    }
  } else if (req.method === "PUT") {
    const {
      eventId,
      eventName,
      startTime,
      endTime,
      alert,
      password,
      theme,
      clock,
    } = JSON.parse(req.body);

    //Checks to see if eventId matches
    if (req.query.eventId && eventId !== req.query.eventId) {
      res.send("Invalid id");
      res.status(404);
    } else if (alert) {
      //If alert is present in the request, updates alert values
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
        res.send(Item.Attributes && Item.Attributes.eventId.S);
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    } else if (clock && theme) {
      //Checks to see if clock type in request, then updates event appropriately
      const params = {
        TableName: "events",
        Key: {
          eventId: { S: eventId },
        },
        UpdateExpression: "set clock = :c, theme = :t",
        ExpressionAttributeValues: {
          ":c": { S: clock },
          ":t": { S: theme },
        },
        ReturnValues: "ALL_NEW",
      };
      try {
        const Item: UpdateItemCommandOutput = await db.send(
          new UpdateItemCommand(params)
        );
        res.send(Item.Attributes && Item.Attributes.eventId.S);
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    } else if (clock) {
      //Checks to see if clock type in request, then updates event appropriately
      const params = {
        TableName: "events",
        Key: {
          eventId: { S: eventId },
        },
        UpdateExpression: "set clock = :c",
        ExpressionAttributeValues: {
          ":c": { S: clock },
        },
        ReturnValues: "ALL_NEW",
      };
      try {
        const Item: UpdateItemCommandOutput = await db.send(
          new UpdateItemCommand(params)
        );
        res.send(Item.Attributes && Item.Attributes.eventId.S);
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    } else if (theme) {
      //Checks to see if theme in request, then updates event appropriately
      const params = {
        TableName: "events",
        Key: {
          eventId: { S: eventId },
        },
        UpdateExpression: "set theme = :t",
        ExpressionAttributeValues: {
          ":t": { S: theme },
        },
        ReturnValues: "ALL_NEW",
      };
      try {
        const Item: UpdateItemCommandOutput = await db.send(
          new UpdateItemCommand(params)
        );
        res.send(Item.Attributes && Item.Attributes.eventId.S);
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    } else if (password && !alert) {
      //If password updated, then this generates encrypted password, and updates/creates new Item accordingly
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const params = {
        TableName: "events",
        Key: {
          eventId: { S: eventId },
        },
        UpdateExpression:
          "set eventName = :n, startTime = :s, endTime = :e, password = :p",
        ExpressionAttributeValues: {
          ":n": { S: eventName },
          ":s": { N: startTime },
          ":e": { N: endTime },
          ":p": { S: hashedPassword },
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
      //Updates or Creates Item where there is no password
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
        res.send(Item.Attributes?.eventId.S);
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    }
  } else if (req.method === "POST") {
    //Checks Password
    if (typeof req.query.eventId === "string") {
      const params: GetItemCommandInput = {
        TableName: "events",
        Key: {
          eventId: { S: req.query.eventId },
        },
        ProjectionExpression:
          "startTime, endTime, eventName, eventId, alert, password",
      };

      try {
        const Item = await db.send(new GetItemCommand(params));
        const { password } = JSON.parse(req.body);

        const validPassword = await bcrypt.compare(
          password,
          Item.Item && Item.Item.password.S
        );

        if (!validPassword) {
          res.status(400).json("wrong passsword");
        } else {
          res.status(200).json("Successful");
        }
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
      }
    }
  } else if (req.method === "DELETE") {
    const { eventId, alert } = JSON.parse(req.body);

    if (alert) {
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
    } else {
      const params = {
        TableName: "events",
        Action: "DELETE",
        Key: {
          eventId: { S: eventId },
        },
        UpdateExpression: "remove password",
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
  }
  return res;
}
