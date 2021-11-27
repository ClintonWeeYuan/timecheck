import { NextPage } from "next";
import { useEffect, useState } from "react";
import AnalogClock from "analog-clock-react";
import { IoMdSettings } from "react-icons/io";
import Clock from "react-live-clock";
import styles from "./MainClock.module.css";
import { Button, Icon } from "semantic-ui-react";
import { useTime, updateTime } from "../TimeProvider/TimeProvider";

const MainClock: NextPage = () => {
  const [isAnalog, setIsAnalog] = useState(false);
  const [digitalSize, setDigitalSize] = useState("100px");
  const [analogSize, setAnalogSize] = useState("600px");
  const [buttonSize, setButtonSize] = useState("massive");
  const time = useTime();
  const newTime = updateTime();

  useEffect(() => {
    const interval = setInterval(() => newTime());

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
    setIsAnalog(!isAnalog);
    newTime();
  }

  return (
    <div>
      <div className={styles.time}>
        <div className={styles.settings}>
          <IoMdSettings size="50px" cursor="pointer" />
        </div>
        <div className={styles.clock}>
          {isAnalog ? (
            <AnalogClock {...options} />
          ) : (
            <Clock
              date={time}
              format={"h:mm:ssa"}
              style={{ fontSize: digitalSize, color: "grey" }}
              ticking={true}
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
          <Icon name={isAnalog ? "clock" : "draft2digital"} />
          {isAnalog ? "Analog" : "Digital"}
        </Button>
      </div>
    </div>
  );
};

export default MainClock;
