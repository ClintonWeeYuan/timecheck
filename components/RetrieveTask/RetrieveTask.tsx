import { NextPage } from "next";
import { Button, Input, Segment } from "semantic-ui-react";
import { useState } from "react";
import Link from "next/link";

const RetrieveTask: NextPage = () => {
  const [eventId, setEventId] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEventId(e.target.value);
  }

  return (
    <Segment textAlign="center" basic vertical>
      <Input placeholder="Event Id" value={eventId} onChange={handleChange} />
      <Link href={`/${eventId}`}>
        <Button>Get Id</Button>
      </Link>
    </Segment>
  );
};

export default RetrieveTask;
