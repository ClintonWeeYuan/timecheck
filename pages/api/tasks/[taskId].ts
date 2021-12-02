import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db";
import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { taskId } = req.query;

  if (req.method === "GET") {
    const params: GetItemCommandInput = {
      TableName: "tasks",
      Key: {
        taskId: { S: taskId },
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
