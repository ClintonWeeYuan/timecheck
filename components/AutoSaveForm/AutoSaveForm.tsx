import { NextPage } from "next";
import {
  Form,
  Button,
  Input,
  TextArea,
  Ref,
  Icon,
  Popup,
  Message,
} from "semantic-ui-react";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { DateInput, TimeInput } from "semantic-ui-react-datetimeinput";
import debounce from "@mui/utils/debounce";
import styles from "./AutoSaveForm.module.css";
import { useEvent } from "../TimeProvider/TimeProvider";
import { toDate } from "date-fns";

interface Event {
  eventId: string;
  eventName: string;
  startTime: Date;
  password?: string;
  endTime: Date;
}

interface Props {
  disabled: boolean;
}
const randomWords = require("random-words");

const AutoSaveForm: NextPage<Props> = (props) => {
  const event = useEvent();
  const [eventName, setEventName] = useState<string>(event ? event.name : "");
  const [password, setPassword] = useState<string>();
  const [eventId, seteventId] = useState(
    event.id ? event.id : randomWords({ exactly: 3, join: "-" })
  );
  const [startTime, setStartTime] = useState(
    event.startTime ? toDate(parseInt(event.startTime)) : new Date()
  );
  const [endTime, setEndTime] = useState(
    event.endTime ? toDate(parseInt(event.endTime)) : new Date()
  );
  const [isSaving, setIsSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  function handleIsSaved() {
    setIsSaved(true);
    const timer = setTimeout(() => {
      setIsSaved(false);
    }, 10000);
    return () => clearTimeout(timer);
  }

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
      handleIsSaved();
    } catch (err) {
      console.log(err);
    }
  }

  const debouncedSave = useCallback(debounce(save, 3000), []);

  useEffect(() => {
    if (eventName !== undefined && !props.disabled && !passwordError) {
      debouncedSave({ eventName, password, startTime, endTime, eventId });
    }
  }, [eventName, startTime, endTime, password]);

  function handleSubmit() {
    if (eventName) {
      const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      if (!password) {
        save({ eventId, eventName, startTime, endTime });
      } else if (password?.match(strongRegex)) {
        console.log("Successful password");
        setPasswordError(false);
        save({ eventId, eventName, startTime, endTime });
      } else {
        console.log("Inadequate password");
        setPasswordError(true);
      }
    }
  }
  return (
    <>
      <Form success={isSaved}>
        <Message
          success
          header="Event Saved"
          content="You can access your event via the URL below"
        />
        <p style={{ fontWeight: "bold" }}> Event Name</p>
        <Form.Input
          fluid
          placeholder="Event"
          value={eventName}
          onChange={changeEvent}
          disabled={props.disabled}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontWeight: "bold" }}>Password (optional)</p>
          <Popup trigger={<Icon circular name="info" />}>
            <h5>Requirements</h5>

            <ul>
              <li>At least 8 characters</li>
              <li>At least 1 Uppercase Letter</li>
              <li>At least 1 Lowercase Letter</li>
              <li>At least 1 Special Character</li>
              <li>At least 1 Number</li>
            </ul>
          </Popup>
          <Popup>
            <h5>Requirements</h5>
            <ul>
              <li>At least 8 characters</li>
              <li>At least 1 Uppercase Letter</li>
              <li>At least 1 Lowercase Letter</li>
              <li>At least 1 Special Character</li>
              <li>At least 1 Number</li>
            </ul>
          </Popup>
        </div>
        <Form.Input
          fluid
          placeholder="Password"
          value={password}
          onChange={changePassword}
          type="password"
          disabled={props.disabled}
          error={passwordError && { content: "Weak Password" }}
        />
        <div className={styles.autosave_details}>
          <Input
            action={{
              color: "teal",
              labelPosition: "right",
              icon: "copy",
              content: "Copy Link",
              onClick: handleClick,
            }}
            defaultValue={link}
            onChange={handleChange}
            readOnly
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
          content="Save"
          primary
          loading={isSaving}
          icon="save"
          type="submit"
          disabled={props.disabled}
          onClick={handleSubmit}
          // onClick={() =>
          //   eventName && save({ eventId, eventName, startTime, endTime })
          // }
        />
      </Form>
    </>
  );
};

export default AutoSaveForm;
