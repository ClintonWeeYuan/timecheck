import { NextPage } from "next";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import type {} from "@mui/lab/themeAugmentation";
import "@mui/lab/themeAugmentation";
import TextField from "@mui/material/TextField";
import styles from "./CountdownSetter.module.css";

import { useCallback, useEffect, useState } from "react";
import debounce from "@mui/utils/debounce";


import { useTime } from "../TimeProvider/TimeProvider";
const util = require("util");
import { format, toDate, intervalToDuration } from "date-fns";
import { duration } from "@mui/material";


function roundSeconds(number: number) {
  return number - ((number % (1000 * 60)) + 1000);
}

interface Props {

  changeStartTime: (value: number) => void;
  changeEndTime: (value: number) => void;
  endTime?: string;
  startTime?: string;
  eventId?: string;
  eventName?: string;
}

const CountdownSetter: NextPage<Props> = (props) => {
  const updatedTime = useTime();
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number>(Date.now());
  const [time, setTime] = useState(Date.now());


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


  }, [updatedTime]);


  function handleStartTime(e: Date) {
    let newTime = roundSeconds(e.getTime());
    setStartTime(newTime);
    props.changeStartTime(newTime);
  }

  function handleEndTime(e: Date) {
    let newTime = roundSeconds(e.getTime());
    setEndTime(newTime);

    props.changeEndTime(roundSeconds(newTime));

  }

  useEffect(() => {
    props.endTime && setEndTime(parseInt(props.endTime));
    props.startTime && setStartTime(parseInt(props.startTime));
  }, [props.endTime, props.startTime]);

  //AutoUpdates StartTime and EndTime in Database

  async function save(startTime: number, endTime: number) {
    try {
      const res = await fetch(`/api/events/${props.eventId}`, {
        method: "PUT",
        body: JSON.stringify({
          eventId: props.eventId,
          eventName: props.eventName,
          startTime: startTime.toString(),
          endTime: endTime.toString(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  const debouncedSave = useCallback(debounce(save, 3000), []);

  useEffect(() => {
    if (props.eventName !== undefined) {
      debouncedSave(startTime, endTime);
    }
    console.log(startTime);
  }, [startTime, endTime]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.setTime}>
        <TimePicker
          label="Start"
          onChange={(newValue: Date | null) => {
            newValue && handleStartTime(newValue);
          }}
          value={startTime}
          renderInput={(params) => <TextField {...params} />}
        />
        {hours}
        {seconds}
        <TimePicker
          label="End"
          onChange={(newValue: Date | null) => {
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
