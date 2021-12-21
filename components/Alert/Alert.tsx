import { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dimmer,
  Header,
  Icon,
  Modal,
} from "semantic-ui-react";

interface Props {
  alert: string;
}

const Alert: NextPage<Props> = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [props.alert]);

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      defaultOpen
      open={open}
      size="small"
      closeIcon
    >
      <Header icon>
        <Icon name="warning" />
        IMPORTANT MESSAGE
      </Header>
      <Modal.Content>
        <h2>{props.alert}</h2>
      </Modal.Content>
      <Modal.Actions></Modal.Actions>
    </Modal>
  );
};

export default Alert;
