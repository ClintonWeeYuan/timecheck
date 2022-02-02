import { NextPage } from "next";
import { useEffect, useState } from "react";
import AnalogClock from "analog-clock-react";
import Clock from "react-live-clock";
import Countdown from "../Countdown/Countdown";
import styles from "./MainClock.module.css";
import Link from "next/link";
import DigitalClock from "../DigitalClock/DigitalClock";
import Head from "next/head";

import { Dropdown, Icon, Menu } from "semantic-ui-react";

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

  const [ampm, setAmpm] = useState(true);
  function handleAmpm(value: boolean) {
    setAmpm(value);
  }

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

  return (
    <div>
      <div className={styles.time}>
        <div style={{ width: "100%" }}>
          <Menu
            fixed="top"
            size="massive"
            style={{ width: "100%", backgroundColor: primary }}
          >
            <Menu.Menu position="left">
              <Dropdown
                style={{
                  padding: "30px",
                  fontSize: "30px",
                  color: accent,
                }}
                item
                icon="content"
              >
                <Dropdown.Menu style={{ fontSize: "20px" }}>
                  <Dropdown.Item>
                    <Link href="/">
                      <a target="_blank">New Event</a>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <AlertSetter />
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Settings
                      handleClockType={(value) => setClockType(value)}
                      clockType={clockType}
                      handleAmpm={handleAmpm}
                      ampm={ampm}
                    />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
            <Menu.Menu position="right">
              {/* <Dropdown
                selection
                options={clockOptions}
                placeholder="Clock Type"
                onChange={(e, { value }) => value && setClockType(value)}
              > */}
              <Dropdown
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "30px",
                }}
                placeholder="Clock Type"
                text={clockType}
              >
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setClockType("Analog")}>
                    <Icon name="clock" />
                    <span>Analog</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setClockType("Digital")}>
                    <Icon name="draft2digital" />
                    <span>Digital</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setClockType("Countdown")}>
                    <Icon name="bomb" />
                    <span>Countdown</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {/* </Dropdown> */}
            </Menu.Menu>
          </Menu>
        </div>

        <div className={styles.clock}>
          {clockType === "Analog" ? (
            <AnalogClock {...options} />
          ) : clockType === "Digital" ? (
            // <Clock
            //   date={time}
            //   format="hh:mm:ssa"
            //   style={{ fontSize: digitalSize, color: secondary }}
            //   ticking={true}
            // />
            <DigitalClock ampm={ampm} />
          ) : (
            <Countdown
              hours={props.hours}
              minutes={props.minutes}
              seconds={props.seconds}
              big={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainClock;
