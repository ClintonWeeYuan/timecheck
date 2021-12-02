import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import db from "../db";
import {
  GetItemCommand,
  GetItemCommandInput,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface Props {
  task: {
    endTime: {
      N: "string";
    };
    startTime: {
      N: "string";
    };
    taskName: {
      S: "string";
    };
  };
}

const Details: NextPage<Props> = (props) => {
  return (
    <div>
      <h1>{props.task.taskName.S}</h1>
    </div>
  );
};

export const getStaticPaths = async () => {
  // const res = await fetch(`http://localhost:3000/api/tasks`, {
  //   method: "GET",
  // });
  // const data = await res.json();

  // const paths = data.map((task: { taskId: { S: string } }) => {
  //   return { params: { id: task.taskId.S } };
  // });

  let paths;
  const params = {
    TableName: "tasks",
  };
  try {
    const Item = await db.send(new ScanCommand(params));

    if (typeof Item.Items !== "undefined") {
      paths = Item.Items.map((task) => {
        return { params: { id: task.taskId.S } };
      });
    }
  } catch (err) {
    console.log(err);
  }

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let data;
  const { id } = context.params as IParams;
  // const res = await fetch(`http://localhost:3000/api/tasks/${id}`);
  // const data = await res.json();
  const params: GetItemCommandInput = {
    TableName: "tasks",
    Key: {
      taskId: { S: id },
    },
    ProjectionExpression: "startTime, endTime, taskName",
  };

  try {
    const Item = await db.send(new GetItemCommand(params));
    console.log(Item);
    data = Item.Item;
    console.log(data);
  } catch (err) {
    console.log(err);
  }

  return {
    props: { task: data },
  };
};

export default Details;
