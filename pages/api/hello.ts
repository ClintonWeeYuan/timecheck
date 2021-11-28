import type { NextApiRequest, NextApiResponse } from "next";
import mitt from "next/dist/shared/lib/mitt";
import db from "../../db";
import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

type Data = {
  clockId: string;
  NewValue: number;
};

type Error = {
  error: string;
};

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const params = {
      TableName: "clocks",
      Key: {
        clockId: { S: "First Clock" },
      },
      ProjectionExpression: "NewValue",
    };

    try {
      const { Item } = await db.send(new GetItemCommand(params));
      res.send(Item ? Item.NewValue.N : {});
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
    }
  }

  return res;
}

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: "John Doe" });
// }
