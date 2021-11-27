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
import { useTime, updateTime } from "../TimeProvider/TimeProvider";

const Taskbar: NextPage = () => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [startTime, setStartTime] = useState(new Date("2014-08-18T21:11:54"));
  const [endTime, setEndTime] = useState(new Date("2014-08-18T21:11:54"));
  const time = useTime();
  const newTime = updateTime();

  useEffect(() => {
    const countDate = new Date("November 27, 2021 23:00:00").getTime();
    const gap = countDate - time;
    setSeconds(Math.floor((gap % (60 * 1000)) / 1000));
    setMinutes(Math.floor((gap % (60 * 60 * 1000)) / (60 * 1000)));
    setHours(Math.floor(gap / (60 * 60 * 1000)));
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
            <TimePicker
              label="Start"
              onChange={setStartTime}
              value={startTime}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label="End"
              onChange={setEndTime}
              value={endTime}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </LocalizationProvider>
      </div>
    </Segment>
  );
};

export default Taskbar;
