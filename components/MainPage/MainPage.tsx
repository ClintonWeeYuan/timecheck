import { NextPage } from "next";
import MainClock from "../MainClock/MainClock";
import Taskbar from "..//Taskbar/Taskbar";
import { Dropdown, Grid, Icon, Menu } from "semantic-ui-react";

import { useEffect, useState } from "react";
import CountdownSetter from "../CountdownSetter/CountdownSetter";

import Alert from "../Alert/Alert";
import { EventType } from "../../pages/[id]";
import { useTheme } from "../ThemeProvider/ThemeProvider";
import { TimeProvider } from "../TimeProvider/TimeProvider";
import Link from "next/link";
import AlertSetter from "../AlertSetter/AlertSetter";
import Settings from "../Settings/Settings";

//Object type for Props, containing both event and time

interface Props {
  event?: EventType;
  time: number;
}

const MainPage: NextPage<Props> = (props) => {
  const [time, setTime] = useState<number>(Date.now());

  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");

  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number>(Date.now());
  const { primary, secondary, accent } = useTheme();

  {
    /*Function to change start times, triggered by changes to CountdownSetter*/
  }
  function changeStartTime(value: number) {
    setStartTime(value);
  }

  function changeEndTime(value: number) {
    setEndTime(value);
  }

  {
    /*Function to change the duration of the Countdown, which are calcualted in CountdownSetter, and ultimately the values of seconds, minutes and hours are passed to Countdown*/
  }

  function handleDuration(value1: string, value2: string, value3: string) {
    setSeconds(value1);
    setMinutes(value2);
    setHours(value3);
  }

  {
    /*Gets time from Server --> THIS MIGHT NOT BE NEEDED ANY MORE*/
  }

  useEffect(() => {
    async function getTime() {
      try {
        const res = await fetch(`${process.env.APP_URL}/api/time`, {
          method: "GET",
        });
        const newTime = await res.json();
        setTime(newTime);
      } catch (err) {
        console.log(err);
      }
    }

    getTime();
  }, []);

  return (
    <div style={{ backgroundColor: primary }}>
      <TimeProvider time={props.time} event={props.event}>
        {props.event && props.event.alert && (
          <Alert alert={props.event.alert} />
        )}

        <Grid stackable divided centered columns={2}>
          <Grid.Column width={12} style={{ padding: "0" }}>
            <MainClock hours={hours} minutes={minutes} seconds={seconds} />
          </Grid.Column>

          <Grid.Column width={4} style={{ padding: "20px" }}>
            {props.event ? (
              <Taskbar hours={hours} minutes={minutes} seconds={seconds} />
            ) : (
              <Taskbar hours={hours} minutes={minutes} seconds={seconds} />
            )}
            <CountdownSetter
              changeEndTime={changeEndTime}
              changeStartTime={changeStartTime}
              handleDuration={handleDuration}
            />
          </Grid.Column>
        </Grid>
      </TimeProvider>
    </div>
  );
};

export default MainPage;
