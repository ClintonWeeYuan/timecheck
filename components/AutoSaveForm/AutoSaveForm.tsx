import { NextPage } from "next";
import { Form, Button, Input, TextArea, Ref, Icon } from "semantic-ui-react";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { DateInput, TimeInput } from "semantic-ui-react-datetimeinput";
import debounce from "@mui/utils/debounce";
import styles from "./AutoSaveForm.module.css";

interface Event {
  eventId: string;
  eventName: string;
  startTime: Date;
  password?: string;
  endTime: Date;
}

const randomWords = require("random-words");

const AutoSaveForm: NextPage = () => {
  const [eventName, setEventName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [eventId, seteventId] = useState(
    randomWords({ exactly: 3, join: "-" })
  );
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);

  function changeStartTimeValue(newTimeValue: Date) {
    setStartTime(newTimeValue);
    console.log(startTime);
  }

  function changeEndTimeValue(newTimeValue: Date) {
    setEndTime(newTimeValue);
  }

  function changeEvent(e: React.ChangeEvent<HTMLInputElement>) {
    setEventName(e.target.value);
  }

  function changePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function roundSeconds(number: number) {
    return number - (number % (1000 * 60)) + 1000;
  }

  const [link, setLink] = useState(`${process.env.APP_URL}/${eventId}`);

  async function handleClick() {
    await navigator.clipboard.writeText(link);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLink(e.target.value);
  }

  async function save({
    eventName,
    password,
    startTime,
    endTime,
    eventId,
  }: Event) {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify({
          eventId: eventId,
          eventName: eventName,
          startTime: roundSeconds(startTime.getTime()).toString(),
          endTime: roundSeconds(endTime.getTime()).toString(),
          password: password,
        }),
      });
      setIsSaving(false);
    } catch (err) {
      console.log(err);
    }
  }

  const debouncedSave = useCallback(debounce(save, 3000), []);

  useEffect(() => {
    if (eventName !== undefined) {
      debouncedSave({ eventName, password, startTime, endTime, eventId });
    }
  }, [eventName, startTime, endTime, password]);

  return (
    <>
      <Form>
        <Form.Input
          fluid
          label="Name of Event"
          placeholder="Event"
          value={eventName}
          onChange={changeEvent}
        />
        <Form.Input
          fluid
          label="Password (optional)"
          placeholder="Password"
          value={password}
          onChange={changePassword}
          type="password"
        />
        <div className={styles.autosave_details}>
          <Input
            action={{
              color: "teal",
              labelPosition: "right",
              icon: "copy",
              content: "Copy",
              onClick: handleClick,
            }}
            defaultValue={link}
            onChange={handleChange}
          />
        </div>
        <h4>Start Time</h4>
        <TimeInput
          dateValue={startTime}
          onDateValueChange={changeStartTimeValue}
          valueType="start"
        />
        <h4>End Time</h4>
        <TimeInput
          dateValue={endTime}
          onDateValueChange={changeEndTimeValue}
          valueType="end"
        />
        <br />

        <Button
          content="Submit"
          primary
          loading={isSaving}
          icon="save"
          type="submit"
          onClick={() =>
            eventName && save({ eventId, eventName, startTime, endTime })
          }
        />
      </Form>
    </>
  );
};

export default AutoSaveForm;
