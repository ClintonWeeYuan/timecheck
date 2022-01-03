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
    const res = await fetch(`${process.env.APP_URL}/api/events/${event.id}`, {
      method: "POST",
      body: JSON.stringify({ password: password }),
    });
    console.log(disabled);

    if (res.status === 200) {
      setIsAuthenticated(true);
      setDisabled(false);
    } else {
      setIsAuthenticated(false);
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

            <Form>
              <Form.Input
                fluid
                label="Password"
                placeholder="Password"
                value={password}
                onChange={changePassword}
              />
              <Button onClick={verifyPassword} type="submit">
                Submit
              </Button>
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
