import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db";
import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { isAfter } from "date-fns";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
}
