import { NextPage } from "next";
import {
  Header,
  Modal,
  Segment,
  Menu,
  Grid,
  MenuItemProps,
  Container,
  Form,
  Button,
  Input,
  Message,
} from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import { IoMdSettings } from "react-icons/io";
import { MenuClassKey } from "@mui/material";
import AutoSaveForm from "../AutoSaveForm/AutoSaveForm";
import TimeSetting from "../TimeSetting/TimeSetting";
import styles from "./Settings.module.css";
import { useEvent } from "../TimeProvider/TimeProvider";

const Settings: NextPage = () => {
  const event = useEvent();
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(event.password ? true : false);
  const [activeItem, setActiveItem] = useState("General");
  const [password, setPassword] = useState<string>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  console.log(event);
  useEffect(() => {
    if (event.password && !isAuthenticated) {
      setDisabled(true);
    }
  }, [disabled, event.password]);

  function handleItemClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    data: MenuItemProps
  ) {
    data.name && setActiveItem(data.name);
  }

  function changePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function verifyPassword() {
    const res = await fetch(`/api/events/${event.id}`, {
      method: "POST",
      body: JSON.stringify({ password: password }),
    });
    console.log(disabled);

    if (res.status === 200) {
      setWrongPassword(false);
      setIsAuthenticated(true);
      setDisabled(false);
    } else {
      setIsAuthenticated(false);
      setWrongPassword(true);
      setDisabled(true);
    }
  }

  return (
    <Segment textAlign="center" basic vertical>
      <Modal
        closeIcon
        open={open}
        trigger={<IoMdSettings size="50px" cursor="pointer" />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        centered={true}
      >
        <Header icon="settings" content="Settings" />
        <Modal.Content>
          <Container>
            <p>You must enter your password to edit settings</p>

            <Form
              onSubmit={verifyPassword}
              success={isAuthenticated}
              error={wrongPassword}
            >
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  placeholder="Password"
                  value={password}
                  onChange={changePassword}
                />

                {/* <Form.Button onClick={verifyPassword} type="submit">
                  Submit
                </Form.Button> */}
                <Form.Button content="Submit" />
              </Form.Group>
              <Message
                success
                header="Password Accepted"
                content="You can now edit the settings below"
              />
              <Message
                error
                header="Invalid Password"
                content="Please check your password and url, and try again"
              />
            </Form>
          </Container>

          <Grid stackable columns={2}>
            <Grid.Column width={4}>
              <Menu fluid secondary pointing tabular vertical>
                <Menu.Item
                  name="General"
                  active={activeItem === "General"}
                  content="General"
                  onClick={handleItemClick}
                />

                <Menu.Item
                  name="Time"
                  active={activeItem === "Time"}
                  content="Time"
                  onClick={handleItemClick}
                />

                <Menu.Item
                  position="right"
                  name="About"
                  active={activeItem === "About"}
                  content="About"
                  onClick={handleItemClick}
                />
              </Menu>
            </Grid.Column>
            <Grid.Column stretched width={12}>
              <Segment padded="very" className={styles.mainSettings}>
                {activeItem === "General" ? (
                  <AutoSaveForm disabled={disabled} />
                ) : activeItem === "Time" ? (
                  <TimeSetting />
                ) : (
                  <h1>About Us</h1>
                )}
              </Segment>
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    </Segment>
  );
};

export default Settings;
