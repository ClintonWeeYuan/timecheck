// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../db.js";

// type Data = {
//   name: string;
// };

export default async function handleRequest(
  req: NextApiRequest,
  res: { json: (arg0: DocumentClient.AttributeMap | undefined) => void }
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
        res.json(data);
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
