import { NextPage } from "next";
import styles from "./Taskbar.module.css";
import { Input, Divider, Segment } from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import Countdown from "../Countdown/Countdown";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import type {} from "@mui/lab/themeAugmentation";
import "@mui/lab/themeAugmentation";
import TextField from "@mui/material/TextField";
import { startOfToday } from "date-fns";
import { useTime } from "../TimeProvider/TimeProvider";
import toDate from "date-fns/toDate";

const Taskbar: NextPage = () => {
  const time: any = useTime();
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(time);
  const [endTime, setEndTime] = useState<number>(time);

  let timeLeft: number;
  let duration: number;

  useEffect(() => {
    timeLeft = endTime - time;
    duration = endTime - startTime;

    if (timeLeft >= duration) {
      setSeconds(Math.floor((duration % (60 * 1000)) / 1000));
      setMinutes(Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000)));
      setHours(Math.floor(duration / (60 * 60 * 1000)));
    } else {
      setSeconds(Math.floor((timeLeft % (60 * 1000)) / 1000));
      setMinutes(Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000)));
      setHours(Math.floor(timeLeft / (60 * 60 * 1000)));
    }
  }, [time]);

  return (
    <Segment
      textAlign="center"
      basic
      vertical
      padded="very"
      className={styles.description}
    >
      <div className={styles.description}>
        <Input transparent placeholder="Task" size="massive" />
        <Divider horizontal>Time Remaining</Divider>
        <Countdown hours={hours} minutes={minutes} seconds={seconds} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className={styles.setTime}>
            {/*There is a problem here where the time picker will contain a random number of extra seconds. I therefore had to manually elminate these extra seconds through calculations of the newValue*/}
            <TimePicker
              label="Start"
              onChange={(newValue: any) => {
                setStartTime(newValue - (newValue % (1000 * 60)) + 1000);
              }}
              value={startTime}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label="End"
              onChange={(newValue: any) => {
                setEndTime(newValue - (newValue % (1000 * 60)) + 1000);
              }}
              value={endTime}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </LocalizationProvider>
      </div>
      <p></p>
    </Segment>
  );
};

export default Taskbar;
