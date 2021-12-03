import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db";
import {
  GetItemCommand,
  GetItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { isAfter } from "date-fns";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { taskId } = req.query;
    let taskIdString: string;

    if (typeof taskId === "string") {
      taskIdString = taskId;
      if (req.method === "GET") {
        const params: GetItemCommandInput = {
          TableName: "tasks",
          Key: {
            taskId: { S: taskIdString },
          },
          ProjectionExpression: "startTime, endTime, taskName",
        };

        try {
          const Item = await db.send(new GetItemCommand(params));
          res.send(Item.Item);
        } catch (err) {
          console.log(err);
          res.statusCode = 500;
        }
      }
    }
  } else if (req.method === "PUT") {
    const { taskId, taskName, startTime, endTime } = JSON.parse(req.body);
    const { taskId1 } = req.query;

    if (taskId1 && taskId !== taskId1) {
      res.send("Invalid id");
      res.status(404);
      console.log("Invalid Id");
    }
    const params = {
      TableName: "tasks",
      Key: {
        taskId: { S: taskId },
      },
      UpdateExpression: "set taskName = :n, startTime = :s, endTime = :e",
      ExpressionAttributeValues: {
        ":n": { S: taskName },
        ":s": { N: startTime },
        ":e": { N: endTime },
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const Item: UpdateItemCommandOutput = await db.send(
        new UpdateItemCommand(params)
      );
      res.send(Item.Attributes ? Item.Attributes.taskId.S : {});
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
    }
  }
  return res;
}
