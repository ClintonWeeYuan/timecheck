import { constants } from "crypto";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { EventType } from "../../pages/[id]";

interface Theme {
  primary: string;
  secondary: string;
  neutral: string;
}
//Create context with useless data

const TimeContext = React.createContext(Date.now());
const TimeUpdateContext = React.createContext(() => {});
const EventContext = React.createContext<EventType>({
  name: "",
  id: "",
  startTime: "",
  endTime: "",
  password: "",
});

//Object type for Props with time and event, passed in from MainPage

interface Props {
  time: number;
  event?: EventType;
}

//Export the functions to be called for the various contexts

export function useTime() {
  return useContext(TimeContext);
}

export function useUpdateTime() {
  return useContext(TimeUpdateContext);
}

export function useEvent() {
  return useContext(EventContext);
}

export const TimeProvider: NextPage<Props> = (props) => {
  //Using server time from props, to find offset with the system time
  const [time, setTime] = useState(props.time);

  let offset = time ? time - Date.now() : 0;

  //Updates time by adding offset to system time, so that it accords with server time
  function updateTime() {
    setTime(Date.now() + offset);
  }

  return (
    <TimeContext.Provider value={time}>
      <TimeUpdateContext.Provider value={updateTime}>
        {props.event ? (
          <EventContext.Provider value={props.event}>
            {props.children}
          </EventContext.Provider>
        ) : (
          props.children
        )}
      </TimeUpdateContext.Provider>
    </TimeContext.Provider>
  );
};
