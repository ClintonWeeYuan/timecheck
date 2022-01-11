import { NextPage } from "next";
import {
  Button,
  Form,
  Header,
  Icon,
  Modal,
  TextArea,
  Segment,
  Dropdown,
} from "semantic-ui-react";
import { useState } from "react";
import { MdOutlineAddAlert } from "react-icons/md";
import { useEvent } from "../TimeProvider/TimeProvider";
import styles from "./AlertSetter.module.css";

interface Props {
  eventId?: string;
}

const AlertSetter: NextPage<Props> = (props) => {
  const event = useEvent();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  //Changes message value based on the input field
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  //Clears alert message from database
  async function clearMessage() {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
        body: JSON.stringify({
          eventId: event.id,
          alert: message,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  //Sends alert message to database, while also creating timeout which triggers the clearMessage function above

  async function handleSubmit() {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        body: JSON.stringify({
          eventId: event.id,
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
    <div
      style={{
        width: "100%",
        textAlign: "center",
      }}
    >
      <Modal
        basic
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="small"
        trigger={
          <Dropdown.Item className={styles.dropdown} text="Send Alert" />
        }
        centered={true}
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
    </div>
  );
};

export default AlertSetter;
