import { NextPage } from "next";
import MainClock from "../MainClock/MainClock";
import Taskbar from "..//Taskbar/Taskbar";
import { Grid } from "semantic-ui-react";

import RetrieveTask from "../RetrieveTask/RetrieveTask";
import { TimeProvider } from "../TimeProvider/TimeProvider";
import styles from "./MainPage.module.css";
import { useEffect, useState } from "react";
import CountdownSetter from "../CountdownSetter/CountdownSetter";

import AlertSetter from "../AlertSetter/AlertSetter";
import Alert from "../Alert/Alert";
import { EventType } from "../../pages/[id]";

interface Props {
  event?: EventType;
  time: number;
}

const MainPage: NextPage<Props> = (props) => {
  const [time, setTime] = useState<number>(Date.now());
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");

  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number>(Date.now());

  function changeStartTime(value: number) {
    setStartTime(value);
  }

  function changeEndTime(value: number) {
    setEndTime(value);
  }

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
      <TimeProvider time={props.time} event={props.event}>
        {props.alert && <Alert alert={props.alert} />}
        <Grid stackable divided columns={2} className={styles.main}>
          <Grid.Column width={12}>
            <MainClock hours={hours} minutes={minutes} seconds={seconds} />
          </Grid.Column>

          <Grid.Column width={4}>
            {props.event ? (
              <Taskbar hours={hours} minutes={minutes} seconds={seconds} />
            ) : (
              <Taskbar hours={hours} minutes={minutes} seconds={seconds} />
            )}
            <CountdownSetter
              changeEndTime={changeEndTime}
              changeStartTime={changeStartTime}
            />
            <RetrieveTask />
          </Grid.Column>
        </Grid>
      </TimeProvider>
    </div>
  );
};

export default MainPage;
