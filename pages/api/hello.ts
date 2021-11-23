// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import type { NextApiRequest, NextApiResponse } from "next";
import mitt from "next/dist/shared/lib/mitt";
import db from "../../db.js";

type Data = {
  clockId: string;
  NewValue: number;
};

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const params = {
      TableName: "clocks",
      Key: {
        clockId: "First Clock",
      },
    };
    db.get(params, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        if (data.Item) {
          const stuff = data.Item as Data;
          res.json(stuff);
        }
      }
    });
  }
}

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: "John Doe" });
// }
