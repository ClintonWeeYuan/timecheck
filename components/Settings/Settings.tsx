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
} from "semantic-ui-react";
import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { MenuClassKey } from "@mui/material";
import AutoSaveForm from "../AutoSaveForm/AutoSaveForm";
import TimeSetting from "../TimeSetting/TimeSetting";
import styles from "./Settings.module.css";
import { useEvent } from "../TimeProvider/TimeProvider";

const Settings: NextPage = () => {
  const event = useEvent();
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("General");
  const [password, setPassword] = useState<string>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleItemClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    data: MenuItemProps
  ) {
    data.name && setActiveItem(data.name);
  }

  function changePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
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
            <p>{isAuthenticated ? "Logged in" : "Error"}</p>
            <Form>
              <Form.Input
                fluid
                label="Password"
                placeholder="Password"
                value={password}
                onChange={changePassword}
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
                  <AutoSaveForm />
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
