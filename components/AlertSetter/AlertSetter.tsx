import { NextPage } from "next";
import { Button, Form, Header, Icon, Modal, TextArea } from "semantic-ui-react";
import { useState } from "react";

interface Props {
  eventId?: string;
}

const AlertSetter: NextPage<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  async function clearMessage() {
    try {
      const res = await fetch(`/api/events/${props.eventId}`, {
        method: "DELETE",
        body: JSON.stringify({
          eventId: props.eventId,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit() {
    try {
      const res = await fetch(`/api/events/${props.eventId}`, {
        method: "PUT",
        body: JSON.stringify({
          eventId: props.eventId,
          alert: message,
        }),
      });
    } catch (err) {
      console.log(err);
    }

    const timer = setTimeout(() => {
      clearMessage();
    }, 10000);

    setOpen(false);

    return () => clearTimeout(timer);
  }

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={<Button color="red">Send Alert</Button>}
    >
      <Header icon>
        <Icon name="warning" />
        Your Alert
      </Header>
      <Modal.Content>
        <Form>
          <TextArea onChange={handleChange} placeholder="Type Your Message" />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Cancel
        </Button>
        <Button color="green" inverted onClick={handleSubmit}>
          <Icon name="checkmark" /> Send
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AlertSetter;
