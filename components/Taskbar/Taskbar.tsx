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
import { useTime } from "../TimeProvider/TimeProvider";

interface Props {
  eventName?: string | undefined;
  startTime?: number;
  endTime?: number;
}

function roundSeconds(number: number) {
  return number - (number % (1000 * 60)) + 1000;
}

const Taskbar: NextPage<Props> = (props) => {
  const time: number = useTime();
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number>(Date.now());

  let timeLeft: number;
  let duration: number;

  useEffect(() => {
    timeLeft = endTime - time;
    duration = endTime - startTime;

    function calculateSeconds(time: number) {
      return Math.floor((time % (60 * 1000)) / 1000 + 100);
    }
    function calculateMinutes(time: number) {
      return Math.floor((time % (60 * 60 * 1000)) / (60 * 1000) + 100);
    }
    function calculateHours(time: number) {
      return Math.floor(time / (60 * 60 * 1000) + 100);
    }

    if (timeLeft >= duration && duration > 0) {
      setSeconds(calculateSeconds(duration).toString().slice(-2));
      setMinutes(calculateMinutes(duration).toString().slice(-2));
      setHours(calculateHours(duration).toString().slice(-2));
    } else if (timeLeft < 0 || duration < 0) {
      setSeconds("00");
      setMinutes("00");
      setHours("00");
    } else {
      setSeconds(calculateSeconds(timeLeft).toString().slice(-2));
      setMinutes(calculateMinutes(timeLeft).toString().slice(-2));
      setHours(calculateHours(timeLeft).toString().slice(-2));
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
        <Input transparent placeholder="Task" size="massive">
          {props.eventName}
        </Input>
        <Divider horizontal>Time Remaining</Divider>
        <Countdown hours={hours} minutes={minutes} seconds={seconds} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className={styles.setTime}>
            <TimePicker
              label="Start"
              onChange={(newValue: any) => {
                setStartTime(roundSeconds(newValue));
              }}
              value={startTime}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label="End"
              onChange={(newValue: any) => {
                setEndTime(roundSeconds(newValue));
              }}
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
