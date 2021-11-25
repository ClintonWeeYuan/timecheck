import { DynamoDBClient, ListTablesOutput } from "@aws-sdk/client-dynamodb";

// AWS.config.update({
//   accessKeyId: process.env.DB_ACCESS_KEY_ID,
//   secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
//   region: "us-east-2",
// });

const db = new DynamoDBClient({
  region: "us-east-2",
});

export default db;
