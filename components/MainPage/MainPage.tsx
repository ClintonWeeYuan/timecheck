import { NextPage } from "next";
import MainClock from "../MainClock/MainClock";
import Taskbar from "..//Taskbar/Taskbar";
import { Grid } from "semantic-ui-react";
const util = require("util");

import RetrieveTask from "../RetrieveTask/RetrieveTask";
import { TimeProvider } from "../TimeProvider/TimeProvider";
import styles from "./MainPage.module.css";
import { useEffect, useState } from "react";
import CountdownSetter from "../CountdownSetter/CountdownSetter";
import { format, toDate, intervalToDuration } from "date-fns";
import { duration } from "@mui/material";

interface Props {
  eventName?: string;
  startTime?: string;
  endTime?: string;
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

  useEffect(() => {
    const interval = setInterval(() => setTime((prev) => prev + 1000), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // let timeLeft: number;
  // let duration: number;

  useEffect(() => {
    // timeLeft = endTime - time;
    // duration = endTime - startTime;
    let duration: Duration = intervalToDuration({
      start: toDate(startTime),
      end: toDate(endTime),
    });

    let timeLeft = intervalToDuration({
      start: toDate(time),
      end: toDate(endTime),
    });
    console.log("duration" + duration.minutes);
    console.log("timeLeft" + timeLeft.seconds);

    if (startTime - time > 0 && endTime - startTime > 0) {
      setSeconds(util.format("%s%s", "0", duration.seconds).slice(-2));
      setMinutes(util.format("%s%s", "0", duration.minutes).slice(-2));
      setHours(util.format("%s%s", "0", duration.hours).slice(-2));
    } else if (endTime - time < 0 || endTime - startTime < 0) {
      setSeconds("00");
      setMinutes("00");
      setHours("00");
    } else {
      setSeconds(util.format("%s%s", "0", timeLeft.seconds).slice(-2));
      setMinutes(util.format("%s%s", "0", timeLeft.minutes).slice(-2));
      setHours(util.format("%s%s", "0", timeLeft.hours).slice(-2));
    }

    // function calculateSeconds(time: number) {
    //   return Math.floor((time % (60 * 1000)) / 1000 + 100);
    // }
    // function calculateMinutes(time: number) {
    //   return Math.floor((time % (60 * 60 * 1000)) / (60 * 1000) + 100);
    // }
    // function calculateHours(time: number) {
    //   return Math.floor(time / (60 * 60 * 1000) + 100);
    // }

    // if (timeLeft >= duration && duration > 0) {
    //   setSeconds(calculateSeconds(duration).toString().slice(-2));
    //   setMinutes(calculateMinutes(duration).toString().slice(-2));
    //   setHours(calculateHours(duration).toString().slice(-2));
    // } else if (timeLeft < 0 || duration < 0) {
    //   setSeconds("00");
    //   setMinutes("00");
    //   setHours("00");
    // } else {
    //   setSeconds(calculateSeconds(timeLeft).toString().slice(-2));
    //   setMinutes(calculateMinutes(timeLeft).toString().slice(-2));
    //   setHours(calculateHours(timeLeft).toString().slice(-2));
    // }

    // setSeconds(format(new Date(timeLeft), "ss"));
    // setMinutes(format(new Date(timeLeft), "mm"));
    // setHours(format(new Date(timeLeft), "HH"));
    // console.log(toDate(timeLeft));
  }, [time]);

  return (
    <div className={styles.container}>
      <TimeProvider time={props.time}>
        <Grid stackable divided columns={2} className={styles.main}>
          <Grid.Column width={12}>
            <MainClock
              time={props.time}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
            />
          </Grid.Column>

          <Grid.Column width={4}>
            {props.startTime && props.endTime ? (
              <Taskbar
                startTime={parseInt(props.startTime)}
                endTime={parseInt(props.endTime)}
                eventName={props.eventName}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
              />
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
