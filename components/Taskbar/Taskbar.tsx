import { NextPage } from "next";
import styles from "./Taskbar.module.css";
import { Input, Divider } from "semantic-ui-react";
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

const Taskbar: NextPage = () => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [startTime, setStartTime] = useState(new Date("2014-08-18T21:11:54"));
  const [endTime, setEndTime] = useState(new Date("2014-08-18T21:11:54"));

  const countdown = () => {
    //const countDate = new Date("November 25, 2021 23:00:00").getTime();
    let interval = setInterval(() => {
      const gap = endTime.getTime() - startTime.getTime();

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;

      const textHours = Math.floor(gap / hour);
      const textMinutes = Math.floor((gap % hour) / minute);
      const textSeconds = Math.floor((gap % minute) / second);

      if (gap < 0) {
        clearInterval(interval.current);
      } else {
        setHours(textHours);
        setMinutes(textMinutes);
        setSeconds(textSeconds);
      }
    });
  };

  useEffect(() => {
    countdown();
  });

  return (
    <div className={styles.description}>
      <Input transparent placeholder="Task" size="massive" />
      <Divider horizontal>Time Remaining</Divider>
      <Countdown hours={hours} minutes={minutes} seconds={seconds} />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
      </LocalizationProvider>
    </div>
  );
};

export default Taskbar;
