import { NextPage } from "next";
import { useEffect, useState } from "react";
import AnalogClock from "analog-clock-react";
import Clock from "react-live-clock";
import Countdown from "../Countdown/Countdown";
import styles from "./MainClock.module.css";
import Link from "next/link";

import { Dropdown, Menu } from "semantic-ui-react";

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

interface clockOption {
  key: string;
  text: string;
  value: string;
  icon: string;
}
const clockOptions: clockOption[] = [
  {
    key: "Analog",
    text: "Analog",
    value: "Analog",
    icon: "clock",
  },
  {
    key: "Digital",
    text: "Digital",
    value: "Digital",

    icon: "draft2digital",
  },
  {
    key: "Countdown",
    text: "Countdown",
    value: "Countdown",
    icon: "bomb",
  },
];

const MainClock: NextPage<Props> = (props) => {
  const [clockType, setClockType] = useState<any>("Digital");
  const [digitalSize, setDigitalSize] = useState("100px");
  const [analogSize, setAnalogSize] = useState("600px");
  const [buttonSize, setButtonSize] = useState<SemanticSIZES | undefined>(
    "massive"
  );
  const time = useTime();
  const newTime = useUpdateTime();
  const { primary, secondary, accent } = useTheme();
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
      setAnalogSize("40vw");
      setButtonSize("large");
    }

    if (window.innerWidth > 900) {
      setDigitalSize("10vw");
      setAnalogSize("30vw");
      setButtonSize("massive");
    }
  });

  //Settings for the Analog Clock
  let options = {
    useCustomTime: true,
    width: analogSize,
    border: true,
    borderColor: "#000000",
    baseColor: accent,
    centerColor: "#459cff",
    centerBorderColor: "#ffffff",
    handColors: {
      second: "#d81c7a",
      minute: primary,
      hour: primary,
    },
    seconds: getSeconds(time),
    minutes: getMinutes(time),
    hours: getHours(time),
  };

  //Function to change clock type upon pressing button

  return (
    <div>
      <div className={styles.time}>
        <div style={{ width: "100%", margin: "0" }}>
          <Menu fixed="top" style={{}} size="massive">
            <Menu.Menu position="left">
              <Dropdown item icon="content">
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link href="/">
                      <a target="_blank">New Event</a>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <AlertSetter />
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Settings />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
            <Menu.Menu position="right">
              <Dropdown
                selection
                options={clockOptions}
                placeholder="Clock Type"
                onChange={(e, { value }) => value && setClockType(value)}
              >
                {/* <Dropdown.Menu>
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
                </Dropdown.Menu> */}
              </Dropdown>
            </Menu.Menu>
          </Menu>
        </div>

        <div className={styles.clock}>
          {clockType === "Analog" ? (
            <AnalogClock {...options} />
          ) : clockType === "Digital" ? (
            <Clock
              date={time}
              format={"h:mm:ssa"}
              style={{ fontSize: digitalSize, color: secondary }}
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
