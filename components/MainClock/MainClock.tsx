import { NextPage } from "next";
import { useEffect, useState } from "react";
import AnalogClock from "analog-clock-react";
import { IoMdSettings } from "react-icons/io";
import Clock from "react-live-clock";
import Countdown from "../Countdown/Countdown";
import styles from "./MainClock.module.css";
import { Button, Icon } from "semantic-ui-react";
import { useTime, useUpdateTime } from "../TimeProvider/TimeProvider";
import { SemanticSIZES } from "semantic-ui-react/dist/commonjs/generic";
import Settings from "../Settings/Settings";

interface Props {
  time: number | undefined;
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

  //Update clock time, by adding 1 second each second
  useEffect(() => {
    const interval = setInterval(() => {
      newTime();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (window.innerWidth <= 900) {
      setDigitalSize("60px");
      setAnalogSize("250px");
      setButtonSize("large");
    }

    if (window.innerWidth > 900) {
      setDigitalSize("10vw");
      setAnalogSize("450px");
      setButtonSize("massive");
    }
  });

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
    seconds: Math.floor((time % (60 * 1000)) / 1000),
    minutes: Math.floor((time % (60 * 60 * 1000)) / (60 * 1000)),
    hours: Math.floor(time / (60 * 60 * 1000)),
  };

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
          {" "}
          <Settings />
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
          <Icon name={clockType === "analog" ? "clock" : "draft2digital"} />
          {clockType === "analog" ? "Analog" : "Digital"}
        </Button>
      </div>
    </div>
  );
};

export default MainClock;
