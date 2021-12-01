import { NextPage } from "next";
import { Button, Input, Segment } from "semantic-ui-react";
import { useState } from "react";

const RetrieveTask: NextPage = () => {
  const [taskId, setTaskId] = useState("");

  function handleChange(e) {
    setTaskId(e.target.value);
  }

  async function handleSubmit() {
    const res = await fetch("/api/task", {
      method: "GET",
    });

    const newId = await res.json();
  }

  return (
    <Segment textAlign="center" basic vertical>
      <Input placeholder="Task Id" value={taskId} onChange={handleChange} />
      <Button onClick={handleSubmit}>Get Id</Button>
    </Segment>
  );
};

export default RetrieveTask;
