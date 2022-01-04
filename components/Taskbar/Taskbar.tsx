import { NextPage } from "next";
import styles from "./Taskbar.module.css";
import { Input, Divider, Segment } from "semantic-ui-react";
import React, { useCallback, useEffect, useState } from "react";
import Countdown from "../Countdown/Countdown";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import debounce from "@mui/utils/debounce";

import type {} from "@mui/lab/themeAugmentation";
import "@mui/lab/themeAugmentation";
import { useEvent, useTime } from "../TimeProvider/TimeProvider";

interface Props {
  hours: string;
  minutes: string;
  seconds: string;
}

function roundSeconds(number: number) {
  return number - (number % (1000 * 60)) + 1000;
}

const Taskbar: NextPage<Props> = (props) => {
  const event = useEvent();
  const [eventName, setEventName] = useState(event ? event.name : "");
  async function save(eventName: string) {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        body: JSON.stringify({
          eventId: event.id,
          eventName: event.name,
          startTime: event.startTime,
          endTime: event.endTime,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  const debouncedSave = useCallback(debounce(save, 3000), []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEventName(e.target.value);
  }

  useEffect(() => {
    if (eventName !== undefined && event) {
      debouncedSave(eventName);
    }
  }, [eventName]);

  //Updates screen to reflect eventName in DynamoDB where it has been changed

  useEffect(() => {
    event && setEventName(event.name);
  }, [event]);

  return (
    <Segment
      textAlign="center"
      basic
      vertical
      padded="very"
      className={styles.description}
    >
      <div className={styles.description}>
        <Input
          onChange={handleChange}
          transparent
          placeholder="Task"
          size="massive"
          value={eventName}
        ></Input>
        <Divider horizontal>Time Remaining</Divider>
        <Countdown
          hours={props.hours}
          minutes={props.minutes}
          seconds={props.seconds}
        />
      </div>
    </Segment>
  );
};

export default Taskbar;
