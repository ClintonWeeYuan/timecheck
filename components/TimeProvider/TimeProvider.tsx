import { constants } from "crypto";
import { NextPage } from "next";
import React from "react";
import { useState, useContext } from "react";

const TimeContext = React.createContext({});
const TimeUpdateContext = React.createContext({});

interface Props {
  children: any;
}

export function useTime() {
  return useContext(TimeContext);
}

export function useUpdateTime() {
  return useContext(TimeUpdateContext);
}

export const TimeProvider: NextPage<Props> = (props) => {
  const [time, setTime] = useState(props.children.props.time);

  function updateTime() {
    setTime((prev: number) => prev + 1000);
  }

  return (
    <TimeContext.Provider value={time}>
      <TimeUpdateContext.Provider value={updateTime}>
        {props.children}
      </TimeUpdateContext.Provider>
    </TimeContext.Provider>
  );
};
