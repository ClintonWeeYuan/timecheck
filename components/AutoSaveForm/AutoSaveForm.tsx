import { NextPage } from "next";
import { Form, Button, Input, TextArea, Ref, Icon } from "semantic-ui-react";
import React, { useState, useEffect, useCallback, useRef } from "react";
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

  // const textAreaRef = useRef<HTMLInputElement>(null);

  // function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
  //   if (textAreaRef.current !== null) {
  //     textAreaRef.current.select();
  //     document.execCommand("copy");
  //   }
  // }

  const [link, setLink] = useState(`${process.env.APP_URL}/${eventId}`);

  async function handleClick() {
    await navigator.clipboard.writeText(link);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLink(e.target.value);
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
  }, [eventName, startTime, endTime]);

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

          {/* <Button loading={isSaving} onClick={handleCopy}>
            Copy Link
          </Button>
          <Ref innerRef={textAreaRef}>
            <TextArea
              placeholder="Your Link"
              value={`${process.env.APP_URL}/${eventId}`}
            />
          </Ref> */}
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
            debouncedSave({ eventId, eventName, startTime, endTime })
          }
        />
      </Form>
    </>
  );
};

export default AutoSaveForm;
