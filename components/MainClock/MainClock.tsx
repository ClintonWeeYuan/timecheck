import { NextPage } from "next";
import { useEffect, useState } from "react";
import AnalogClock from "analog-clock-react";
import { IoMdSettings } from "react-icons/io";
import Grid from "@mui/material/Grid";
import { style } from "@mui/system";
import Clock from "react-live-clock";
import styles from "./MainClock.module.css";
import { Button, Icon } from "semantic-ui-react";

const MainClock: NextPage = () => {
  const [isAnalog, setIsAnalog] = useState(false);
  const [value, setValue] = useState(new Date());
  const [digitalSize, setDigitalSize] = useState("100px");
  const [analogSize, setAnalogSize] = useState("600px");
  const [buttonSize, setButtonSize] = useState("massive");

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

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
  };

  function handleClick() {
    setIsAnalog(!isAnalog);
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
