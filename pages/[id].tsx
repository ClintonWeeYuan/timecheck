import { NextPage, GetServerSideProps } from "next";
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const res = await fetch(`${process.env.HOST}api/tasks/${id}`, {
    method: "GET",
  });
  const task = await res.json();

  return {
    props: { task: task },
  };
};
export default Details;
