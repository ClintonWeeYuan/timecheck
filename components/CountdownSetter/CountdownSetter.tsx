import { NextPage } from "next";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import type {} from "@mui/lab/themeAugmentation";
import "@mui/lab/themeAugmentation";
import TextField from "@mui/material/TextField";
import styles from "./CountdownSetter.module.css";
import { useEvent } from "../TimeProvider/TimeProvider";
import {
  Container,
  Label,
  Radio,
  Segment,
  TransitionablePortal,
} from "semantic-ui-react";

import { useCallback, useEffect, useState } from "react";
import debounce from "@mui/utils/debounce";

import { useTime } from "../TimeProvider/TimeProvider";
const util = require("util");
import { toDate, intervalToDuration, format } from "date-fns";
import { useTheme } from "../ThemeProvider/ThemeProvider";

//Function that rounds Date number to nearest minute, removing the seconds for the startime and endtime

function roundSeconds(number: number) {
  return number - ((number % (1000 * 60)) + 1000);
}

//Object type for Props, including function to change the start time, end time, and duration.

interface Props {
  changeStartTime: (value: number) => void;
  changeEndTime: (value: number) => void;
  handleDuration: (value1: string, value2: string, value3: string) => void;
}

const CountdownSetter: NextPage<Props> = (props) => {
  const { primary, secondary, accent } = useTheme();
  const [checked, setChecked] = useState(true);
  //Time and Event from context
  const updatedTime = useTime();
  const event = useEvent();

  //Numbers to be used in Countdown
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");

  //Times used
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number>(Date.now());
  const [time, setTime] = useState(Date.now());

  //Calculate relevant durations, and setting the numbers for the countdown
  useEffect(() => {
    updatedTime && setTime(updatedTime);

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

  //Once number for countdown has been calculated, upload these values into the parent component, i.e. the MainPage.tsx

  useEffect(() => {
    props.handleDuration(seconds, minutes, hours);
  });

  //These functions are linked to the timesetters below, and help to change the start and end times of this components and the parent component

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

  //If change is made to the start or end time in the database, this updates the current page to reflect the new values

  useEffect(() => {
    if (event && event.endTime && event.startTime) {
      setEndTime(parseInt(event.endTime));
      setStartTime(parseInt(event.startTime));
    }
  }, [event]);

  //AutoUpdates StartTime and EndTime in Database

  // async function save(startTime: number, endTime: number) {
  //   try {
  //     const res = await fetch(`/api/events/${event.id}`, {
  //       method: "PUT",
  //       body: JSON.stringify({
  //         eventId: event.id,
  //         eventName: event.name,
  //         startTime: startTime.toString(),
  //         endTime: endTime.toString(),
  //       }),
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // const debouncedSave = useCallback(debounce(save, 3000), []);

  // useEffect(() => {
  //   if (event && event.name !== undefined) {
  //     debouncedSave(startTime, endTime);
  //   }
  // }, [startTime, endTime]);

  return (
    // <LocalizationProvider dateAdapter={AdapterDateFns}>
    //   <div className={styles.setTime}>
    //     <TimePicker
    //       label="Start"
    //       readOnly
    //       onChange={(newValue: Date | null) => {
    //         newValue && handleStartTime(newValue);
    //       }}
    //       value={startTime}
    //       renderInput={(params) => <TextField {...params} />}
    //     />
    //     <TimePicker
    //       label="End"
    //       onChange={(newValue: Date | null) => {
    //         newValue && handleEndTime(newValue);
    //       }}
    //       readOnly
    //       value={endTime}
    //       renderInput={(params) => <TextField {...params} />}
    //     />
    //   </div>
    // </LocalizationProvider>
    <div className={styles.container}>
      <div style={{ display: "flex" }}>
        <Radio
          style={{ color: "yellow" }}
          toggle
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <p style={{ marginLeft: "10px", color: secondary }}>
          Show Start Time and End Time
        </p>
      </div>
      {checked && (
        <div className={styles.time}>
          <Segment.Group style={{}}>
            <Segment
              raised
              style={{
                backgroundColor: primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${secondary}`,
                borderRadius: "10px",
              }}
            >
              <Label
                style={{
                  width: "80px",
                  backgroundColor: accent,
                  color: primary,
                }}
                horizontal
              >
                Start Time
              </Label>
              <p
                style={{
                  marginLeft: "20px",
                  color: secondary,
                  fontWeight: "bold",
                }}
              >
                {format(startTime, "K : mm : ss aaaa")}
              </p>
            </Segment>
            <Segment
              style={{
                backgroundColor: primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${secondary}`,
                borderRadius: "10px",
              }}
              raised
            >
              <Label
                style={{
                  width: "80px",
                  backgroundColor: accent,
                  color: primary,
                }}
                horizontal
              >
                End Time
              </Label>
              <p
                style={{
                  marginLeft: "20px",
                  color: secondary,
                  fontWeight: "bold",
                }}
              >
                {format(endTime, "K : mm : ss aaaa")}
              </p>
            </Segment>
          </Segment.Group>
        </div>
      )}
    </div>
  );
};

export default CountdownSetter;
