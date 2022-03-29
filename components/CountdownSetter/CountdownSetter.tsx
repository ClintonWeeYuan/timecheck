import { NextPage } from "next";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
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
  Accordion,
  Icon,
  Grid,
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
      end: toDate(roundSeconds(endTime) + 1000),
    });

    let timeLeft: Duration = intervalToDuration({
      start: toDate(time),
      end: toDate(roundSeconds(endTime) + 1000),
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

  //If change is made to the start or end time in the database, this updates the current page to reflect the new values

  useEffect(() => {
    if (event && event.endTime && event.startTime) {
      setEndTime(parseInt(event.endTime));
      setStartTime(parseInt(event.startTime));
    }
  }, [event]);

  //Accordion index

  const [activeIndex, setActiveIndex] = useState(-1);

  function handleAccordion() {
    setActiveIndex(activeIndex === 0 ? -1 : 0);
  }

  return (
    <div className={styles.container}>
      <Accordion className={styles.accordion}>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleAccordion}
          sx={{ color: "yellow" }}
        >
          <Icon
            color={primary == "#121212" ? "purple" : "black"}
            name="dropdown"
          />
          <span style={{ color: secondary }}>Start and End Times</span>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Container>
            <Label
              style={{
                width: "30%",
                marginBottom: "10px",
                marginRight: "20px",
                display: "inline-flex ",
                justifyContent: "center",
                backgroundColor: accent,
                color: "whitesmoke",
              }}
            >
              START
            </Label>
            <span style={{ color: secondary }}>
              {format(startTime, "KK : mm : ss aaaa")}
            </span>
          </Container>
          <Container>
            <Label
              style={{
                width: "30%",
                marginBottom: "10px",
                marginRight: "20px",
                display: "inline-flex",
                justifyContent: "center",
                backgroundColor: secondary,
                color: "whitesmoke",
              }}
            >
              END
            </Label>

            <span style={{ color: secondary }}>
              {format(endTime, "KK : mm : ss aaaa")}
            </span>
          </Container>
        </Accordion.Content>
      </Accordion>
    </div>
  );
};

export default CountdownSetter;
