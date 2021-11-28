import type { NextApiRequest, NextApiResponse } from "next";
import mitt from "next/dist/shared/lib/mitt";

//Handles requests for time
export default async function getTime(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const time = Date.now();
      res.send(time);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
    }
  }

  return res;
}
