import { NextPage } from "next";
import { Form, Button, Loader, Dimmer } from "semantic-ui-react";
import React, { useState, useEffect, useCallback } from "react";
import { DateInput, TimeInput } from "semantic-ui-react-datetimeinput";
import debounce from "@mui/utils/debounce";
import styles from "./AutoSaveForm.module.css";

const AutoSaveForm: NextPage = () => {
  const [eventName, setEvent] = useState<string>();
  const [eventId, seteventId] = useState(
    Math.floor(Math.random() * 1000).toString()
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
    setEvent(e.target.value);
  }

  function roundSeconds(number: number) {
    return number - (number % (1000 * 60)) + 1000;
  }

  const debouncedSave = useCallback(
    debounce(async ({ eventName, startTime, endTime, eventId }) => {
      try {
        setIsSaving(true);
        const res = await fetch(`/api/events/${eventId}`, {
          method: "PUT",
          body: JSON.stringify({
            eventId: eventId,
            eventName: eventName,
            startTime: roundSeconds(startTime.getTime()).toString(),
            endTime: roundSeconds(endTime.getTime()).toString(),
          }),
        });
        setIsSaving(false);
      } catch (err) {
        console.log(err);
      }
    }, 4000),
    []
  );

  useEffect(() => {
    if (eventName !== undefined) {
      debouncedSave({ eventName, startTime, endTime, eventId });
    }
  }, [eventName]);

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
        <div className={styles.autosave_details}>
          <Dimmer active={isSaving} inverted>
            <Loader>Saving</Loader>
          </Dimmer>
          <span>Your id is {eventId}</span>
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

        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
};

export default AutoSaveForm;
