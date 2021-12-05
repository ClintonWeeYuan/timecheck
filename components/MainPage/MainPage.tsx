import { NextPage, GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import MainClock from "../MainClock/MainClock";
import Taskbar from "..//Taskbar/Taskbar";
import { Grid } from "semantic-ui-react";
import FormModal from "../FormModal/FormModal";
import RetrieveTask from "../RetrieveTask/RetrieveTask";
import { TimeProvider } from "../TimeProvider/TimeProvider";
import styles from "./MainPage.module.css";
import { useEffect, useState } from "react";

interface Props {
  eventName?: string;
  startTime?: string;
  endTime?: string;
  time: number;
}

const MainPage: NextPage<Props> = (props) => {
  const [time, setTime] = useState<number>(Date.now());

  useEffect(() => {
    async function getTime() {
      try {
        const res = await fetch(`${process.env.APP_URL}/api/time`, {
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
      <TimeProvider time={props.time}>
        <Grid stackable divided columns={2} className={styles.main}>
          <Grid.Column width={12}>
            <MainClock time={props.time} />
          </Grid.Column>

          <Grid.Column width={4}>
            {props.startTime ? (
              <Taskbar
                startTime={parseInt(props.startTime)}
                endTime={parseInt(props.endTime)}
                eventName={props.eventName}
              />
            ) : (
              <Taskbar />
            )}
            <RetrieveTask />
            <FormModal />
          </Grid.Column>
        </Grid>
      </TimeProvider>
    </div>
  );
};

export default MainPage;
