import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db";
import {
  PutItemCommand,
  PutItemCommandOutput,
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

  return res;
}
