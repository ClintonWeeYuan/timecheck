import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db";
import {
  PutItemCommand,
  PutItemCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const params = {
      TableName: "tasks",
    };

    try {
      const Item = await db.send(new ScanCommand(params));
      res.send(Item.Items);
      console.log(Item.Items);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
    }
  } else if (req.method === "POST") {
    const { taskId, taskName, startTime, endTime } = JSON.parse(req.body);
    const params = {
      TableName: "tasks",
      Item: {
        taskId: { S: taskId },
        taskName: { S: taskName },
        startTime: { N: startTime },
        endTime: { N: endTime },
      },
      ReturnValues: "ALL_OLD",
    };

    try {
      const Item: PutItemCommandOutput = await db.send(
        new PutItemCommand(params)
      );
      res.json(Item);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
    }
    return;
  }

  // else if (req.method === "PUT") {
  //   const { taskId, taskName, startTime, endTime } = JSON.parse(req.body);
  //   const params = {
  //     TableName: "tasks",
  //     Key: {
  //       taskId: { S: taskId },
  //     },
  //     UpdateExpression: "set taskName = :n, startTime = :s, endTime = :e",
  //     ExpressionAttributeValues: {
  //       ":n": { S: taskName },
  //       ":s": { N: startTime },
  //       ":e": { N: endTime },
  //     },
  //     ReturnValues: "ALL_NEW",
  //   };

  //   try {
  //     const Item: UpdateItemCommandOutput = await db.send(
  //       new UpdateItemCommand(params)
  //     );
  //     res.send(Item.Attributes ? Item.Attributes.taskId.S : {});
  //   } catch (err) {
  //     console.log(err);
  //     res.statusCode = 500;
  //   }
  // }

  return res;
}
