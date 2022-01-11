import { NextPage } from "next";
import { useEffect, useState } from "react";
import AnalogClock from "analog-clock-react";
import Clock from "react-live-clock";
import Countdown from "../Countdown/Countdown";
import styles from "./MainClock.module.css";

import { Button, Dropdown, Icon, Menu } from "semantic-ui-react";

import { useTime, useUpdateTime, useEvent } from "../TimeProvider/TimeProvider";

import { useTheme, useUpdateTheme } from "../ThemeProvider/ThemeProvider";

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
  const clockTypes = ["digital", "analog", "countdown"];
  const [clockType, setClockType] = useState(clockTypes[0]);
  const [digitalSize, setDigitalSize] = useState("100px");
  const [analogSize, setAnalogSize] = useState("600px");
  const [buttonSize, setButtonSize] = useState<SemanticSIZES | undefined>(
    "massive"
  );
  const time = useTime();
  const newTime = useUpdateTime();
  const { primary, secondary, neutral } = useTheme();
  const updateTheme = useUpdateTheme();

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
      setAnalogSize("250px");
      setButtonSize("large");
    }

    if (window.innerWidth > 900) {
      setDigitalSize("10vw");
      setAnalogSize("400px");
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

  function handleClick() {
    let index = clockTypes.indexOf(clockType);

    if (index === 2) {
      setClockType(clockTypes[0]);
    } else {
      setClockType(clockTypes[index + 1]);
    }
  }

  return (
    <div>
      <div className={styles.time}>
        <div className={styles.settings}>
          {/* <Settings />
          <AlertSetter /> */}

          <Dropdown
            style={{ fontSize: "40px", margin: "20px" }}
            item
            icon="content"
          >
            <Dropdown.Menu direction="right">
              <Dropdown.Item>
                <Settings />
              </Dropdown.Item>
              <Dropdown.Item>
                <AlertSetter />
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

        <Button
          onClick={handleClick}
          icon
          labelPosition="left"
          color="yellow"
          size={buttonSize}
        >
          <Icon
            name={
              clockType === "analog"
                ? "clock"
                : clockType === "digital"
                ? "draft2digital"
                : "bomb"
            }
          />
          {clockType === "analog"
            ? "Analog"
            : clockType === "digital"
            ? "Digital"
            : "Countdown"}
        </Button>
      </div>
    </div>
  );
};

export default MainClock;
