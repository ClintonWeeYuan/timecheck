import { NextPage } from "next";
import { Button, Input, Segment } from "semantic-ui-react";
import { useState } from "react";
import Link from "next/link";

const RetrieveTask: NextPage = () => {
  const [taskId, setTaskId] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTaskId(e.target.value);
  }

  return (
    <Segment textAlign="center" basic vertical>
      <Input placeholder="Task Id" value={taskId} onChange={handleChange} />
      <Link href={`/${taskId}`}>
        <Button>Get Id</Button>
      </Link>
    </Segment>
  );
};

export default RetrieveTask;
