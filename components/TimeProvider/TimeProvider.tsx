import { NextPage } from "next";
import React from "react";
import { useState, useContext } from "react";

const TimeContext = React.createContext(Date.now());
const TimeUpdateContext = React.createContext(() => {
  setTimeout("2pm");
});

export function useTime() {
  return useContext(TimeContext);
}

export function updateTime() {
  return useContext(TimeUpdateContext);
}

export const TimeProvider: NextPage = ({ children }) => {
  const [time, setTime] = useState(Date.now());

  function updateTime() {
    setTime(Date.now());
  }

  return (
    <TimeContext.Provider value={time}>
      <TimeUpdateContext.Provider value={updateTime}>
        {children}
      </TimeUpdateContext.Provider>
    </TimeContext.Provider>
  );
};
