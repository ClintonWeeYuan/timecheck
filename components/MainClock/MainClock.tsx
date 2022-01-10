import { NextPage } from "next";
import { useEffect, useState } from "react";
import AnalogClock from "analog-clock-react";
import Clock from "react-live-clock";
import Countdown from "../Countdown/Countdown";
import styles from "./MainClock.module.css";
import Link from "next/link";

import { Button, Dropdown, Icon, Menu } from "semantic-ui-react";

import { useTime, useUpdateTime, useEvent } from "../TimeProvider/TimeProvider";

import { SemanticSIZES } from "semantic-ui-react/dist/commonjs/generic";
import Settings from "../Settings/Settings";
import AlertSetter from "../AlertSetter/AlertSetter";
import { getSeconds, getMinutes, getHours } from "date-fns";

interface Props {
  hours: string;
  minutes: string;
  seconds: string;
}

const MainClock: NextPage<Props> = (props) => {
  const [clockType, setClockType] = useState("digital");
  const [digitalSize, setDigitalSize] = useState("100px");
  const [analogSize, setAnalogSize] = useState("600px");
  const [buttonSize, setButtonSize] = useState<SemanticSIZES | undefined>(
    "massive"
  );
  const time = useTime();
  const newTime = useUpdateTime();

  //Update clock time, by calling updateTime from TimeProvider Context
  useEffect(() => {
    const interval = setInterval(() => {
      newTime();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  //Sets different sizes depending on window size
  useEffect(() => {
    if (window.innerWidth <= 900) {
      setDigitalSize("60px");
      setAnalogSize("40vw");
      setButtonSize("large");
    }

    if (window.innerWidth > 900) {
      setDigitalSize("10vw");
      setAnalogSize("35vw");
      setButtonSize("massive");
    }
  });

  //Settings for the Analog Clock
  let options = {
    useCustomTime: true,
    width: analogSize,
    border: true,
    borderColor: "#000000",
    baseColor: "#7c93b2",
    centerColor: "#459cff",
    centerBorderColor: "#ffffff",
    handColors: {
      second: "#d81c7a",
      minute: "#ffffff",
      hour: "#ffffff",
    },
    seconds: getSeconds(time),
    minutes: getMinutes(time),
    hours: getHours(time),
  };

  //Function to change clock type upon pressing button

  return (
    <div>
      <div className={styles.time}>
        <div className={styles.settings}>
          <Dropdown
            style={{ fontSize: "40px", margin: "20px" }}
            item
            icon="content"
          >
            <Dropdown.Menu
              direction="right"
              style={{
                width: "200px",
                padding: "0",
              }}
            >
              <a href="/" target="_blank">
                <Dropdown.Item text="New Event" className={styles.dropdown} />
              </a>
              <AlertSetter />
              <Settings />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            style={{ fontSize: "20px", margin: "20px" }}
            item
            text="Clock Type"
          >
            <Dropdown.Menu
              direction="right"
              style={{
                width: "200px",
                padding: "0",
              }}
            >
              <Dropdown.Item onClick={() => setClockType("analog")}>
                <Icon name="clock" />
                <span>Analog</span>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setClockType("digital")}>
                <Icon name="draft2digital" />
                <span>Digital</span>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setClockType("countdown")}>
                <Icon name="bomb" />
                <span>Countdown</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className={styles.clock}>
          {clockType === "analog" ? (
            <AnalogClock {...options} />
          ) : clockType === "digital" ? (
            <Clock
              date={time}
              format={"h:mm:ssa"}
              style={{ fontSize: digitalSize, color: "grey" }}
              ticking={true}
            />
          ) : (
            <Countdown
              hours={props.hours}
              minutes={props.minutes}
              seconds={props.seconds}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainClock;
