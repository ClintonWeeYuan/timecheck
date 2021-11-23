import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

AWS.config.update({
  accessKeyId: process.env.DB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
  region: "us-east-2",
});

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "latest" });

// let table = "clocks";

// let clockId = 9999;

// let params = {
//   TableName: table,
//   Item: {
//     clockId: clockId,
//   },
// };

// console.log("Adding a new item...");
// db.put(params, function (err, data) {
//   if (err) {
//     console.error("Unable to add item");
//   } else {
//     console.log("Added item:", JSON.stringify(data, null, 2));
//   }
// });

export default db;
