import { NextPage } from "next";
import { Button, Header, Icon, Modal, Segment } from "semantic-ui-react";
import { useState } from "react";
import AutoSaveForm from "../AutoSaveForm/AutoSaveForm";

const FormModal: NextPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <Segment textAlign="center" basic vertical>
      <Modal
        closeIcon
        open={open}
        trigger={<Button>Add Task</Button>}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        centered={true}
      >
        <Header icon="archive" content="Schedule a Task" />
        <Modal.Content>
          <AutoSaveForm />
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setOpen(false)}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button color="green" onClick={() => setOpen(false)}>
            <Icon name="checkmark" /> Finish
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
};

export default FormModal;
