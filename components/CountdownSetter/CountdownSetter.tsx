import { NextPage } from "next";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import type {} from "@mui/lab/themeAugmentation";
import "@mui/lab/themeAugmentation";
import TextField from "@mui/material/TextField";
import styles from "./CountdownSetter.module.css";
import { useEffect, useState } from "react";

function roundSeconds(number: number) {
  return number - (number % (1000 * 60)) + 1000;
}

interface Props {
  changeStartTime: (value: number) => void;
  changeEndTime: (value: number) => void;
  endTime?: string;
  startTime?: string;
}

const CountdownSetter: NextPage<Props> = (props) => {
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number>(Date.now());

  function handleStartTime(e: number) {
    setStartTime(e);
    props.changeStartTime(roundSeconds(e));
  }

  function handleEndTime(e: number) {
    setEndTime(e);
    props.changeEndTime(roundSeconds(e));
  }

  useEffect(() => {
    props.endTime && setEndTime(parseInt(props.endTime));
    props.startTime && setStartTime(parseInt(props.startTime));
  }, [props.endTime, props.startTime]);

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
