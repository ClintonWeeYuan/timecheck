import { NextPage } from "next";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import type {} from "@mui/lab/themeAugmentation";
import "@mui/lab/themeAugmentation";
import TextField from "@mui/material/TextField";
import styles from "./CountdownSetter.module.css";
import { useEffect, useState } from "react";
import { useTime } from "../TimeProvider/TimeProvider";
const util = require("util");
import { format, toDate, intervalToDuration } from "date-fns";
import { duration } from "@mui/material";

function roundSeconds(number: number) {
  return number - ((number % (1000 * 60)) + 1000);
}

interface Props {
  handleSeconds: (value: string) => void;
  handleMinutes: (value: string) => void;
  handleHours: (value: string) => void;
}

const CountdownSetter: NextPage<Props> = (props) => {
  const updatedTime = useTime();
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number>(Date.now());
  const [time, setTime] = useState(Date.now());

  function handleSeconds() {
    props.handleSeconds(seconds);
  }

  function handleMinutes() {
    props.handleMinutes(minutes);
  }

  function handleHours() {
    props.handleHours(hours);
  }

  useEffect(() => {
    updatedTime && setTime(updatedTime);
    // timeLeft = endTime - time;
    // duration = endTime    - startTime;

    let duration: Duration = intervalToDuration({
      start: toDate(roundSeconds(startTime)),
      end: toDate(roundSeconds(endTime)),
    });

    let timeLeft: Duration = intervalToDuration({
      start: toDate(time),
      end: toDate(roundSeconds(endTime)),
    });

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

    handleSeconds();
    handleMinutes();
    handleHours();
  }, [updatedTime]);

  function handleStartTime(e: number) {
    setStartTime(e);
  }

  function handleEndTime(e: number) {
    setEndTime(e);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.setTime}>
        <TimePicker
          label="Start"
          onChange={(newValue: number | null) => {
            newValue && handleStartTime(newValue);
          }}
          value={startTime}
          renderInput={(params) => <TextField {...params} />}
        />
        {hours}
        {seconds}
        <TimePicker
          label="End"
          onChange={(newValue: number | null) => {
            newValue && handleEndTime(newValue);
          }}
          value={endTime}
          renderInput={(params) => <TextField {...params} />}
        />
      </div>
    </LocalizationProvider>
  );
};

export default CountdownSetter;
