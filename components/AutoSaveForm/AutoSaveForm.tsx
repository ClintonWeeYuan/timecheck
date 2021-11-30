import { NextPage } from "next";
import { Form, Button } from "semantic-ui-react";
import { useState, useEffect, useCallback } from "react";
import { DateInput, TimeInput } from "semantic-ui-react-datetimeinput";
import debounce from "@mui/utils/debounce";

function AutoSave({
  taskName,
  startTime,
  endTime,
  taskId,
}: {
  taskName: string | undefined;
  startTime: Date;
  endTime: Date;
  taskId: string;
}) {
  const debouncedSave = useCallback(
    debounce(async ({ taskName, startTime, endTime, taskId }) => {
      const res = await fetch("/api/task", {
        method: "PUT",
        body: JSON.stringify({
          taskId: taskId,
          taskName: taskName,
          startTime: startTime.getTime().toString(),
          endTime: endTime.getTime().toString(),
        }),
      });
      const data = await res.json();
      console.log(res.ok);
    }, 4000),
    []
  );

  useEffect(() => {
    if ({ taskName }) {
      debouncedSave({ taskName, startTime, endTime, taskId });
    }
  });
  return null;
}
const AutoSaveForm: NextPage = () => {
  const [taskName, setTask] = useState();
  const [taskId, setTaskId] = useState(
    Math.floor(Math.random() * 1000).toString()
  );
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  function changeStartTimeValue(newTimeValue: Date) {
    setStartTime(newTimeValue);
    console.log(startTime);
  }

  function changeEndTimeValue(newTimeValue: Date) {
    setEndTime(newTimeValue);
  }

  function changeTask(e: { target: { value: any } }) {
    setTask(e.target.value);
  }

  return (
    <>
      <Form>
        <Form.Input
          fluid
          label="Name of Task"
          placeholder="Task"
          value={taskName}
          onChange={changeTask}
        />
        {taskId ? `Your id is ${taskId}` : null}
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
      <AutoSave
        taskName={taskName}
        startTime={startTime}
        endTime={endTime}
        taskId={taskId}
      />
    </>
  );
};

export default AutoSaveForm;
