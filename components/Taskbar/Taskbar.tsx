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
  taskName?: string;
  startTime?: string;
  endTime?: string;
}

function roundSeconds(number: number) {
  return number - (number % (1000 * 60)) + 1000;
}

const Taskbar: NextPage<Props> = (props) => {
  const time: any = useTime();
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(
    props.startTime ? parseInt(props.startTime) : time
  );
  const [endTime, setEndTime] = useState<number>(
    props.endTime ? parseInt(props.endTime) : time
  );

  let timeLeft: number;
  let duration: number;

  useEffect(() => {
    timeLeft = endTime - time;
    duration = endTime - startTime;

    if (timeLeft >= duration) {
      setSeconds(Math.floor((duration % (60 * 1000)) / 1000));
      setMinutes(Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000)));
      setHours(Math.floor(duration / (60 * 60 * 1000)));
    } else if (timeLeft < 0 || duration < 0) {
      setSeconds(0);
      setMinutes(0);
      setHours(0);
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
        <Input transparent placeholder="Task" size="massive">
          {props.taskName}
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
