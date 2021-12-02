import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import db from "../db";
import {
  GetItemCommand,
  GetItemCommandInput,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import MainClock from "../components/MainClock/MainClock";
import Taskbar from "../components/Taskbar/Taskbar";
import { Grid } from "semantic-ui-react";
import FormModal from "../components/FormModal/FormModal";
import RetrieveTask from "../components/RetrieveTask/RetrieveTask";
import { TimeProvider } from "../components/TimeProvider/TimeProvider";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

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
  const [time, setTime] = useState<number>(Date.now());
  useEffect(() => {
    async function getTime() {
      try {
        const res = await fetch(`${process.env.HOST}api/time`, {
          method: "GET",
        });
        const newTime = await res.json();
        setTime(newTime);
      } catch (err) {
        console.log(err);
      }
    }

    getTime();
  }, []);
  return (
    <div className={styles.container}>
      <TimeProvider time={time}>
        <Grid stackable divided columns={2} className={styles.main}>
          <Grid.Column width={12}>
            <MainClock time={time} />
          </Grid.Column>

          <Grid.Column width={4}>
            <Taskbar
              taskName={props.task.taskName.S}
              startTime={props.task.startTime.N}
              endTime={props.task.endTime.N}
            />
            <RetrieveTask />
            <FormModal />
          </Grid.Column>
        </Grid>
      </TimeProvider>
    </div>
  );
};

export const getStaticPaths = async () => {
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
