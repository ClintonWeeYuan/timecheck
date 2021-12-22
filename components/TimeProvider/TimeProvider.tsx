import { constants } from "crypto";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { EventType } from "../../pages/[id]";

const TimeContext = React.createContext(Date.now());
const TimeUpdateContext = React.createContext(() => {});
const EventContext = React.createContext({
  name: "123",
  id: "123",
  startTime: "123",
  endTime: "123",
});

interface Props {
  time: number;
  event?: EventType;
}

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
  const [time, setTime] = useState(props.time);

  let offset = time ? time - Date.now() : 0;

  function updateTime() {
    setTime(Date.now() + offset);
  }

  return (
    <TimeContext.Provider value={time}>
      <TimeUpdateContext.Provider value={updateTime}>
        <EventContext.Provider value={props.event}>
          {props.children}
        </EventContext.Provider>
      </TimeUpdateContext.Provider>
    </TimeContext.Provider>
  );
};
