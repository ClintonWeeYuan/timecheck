import type { NextPage, GetServerSideProps } from "next";
const randomWords = require("random-words");

import MainPage from "../components/MainPage/MainPage";

import { useEffect, useState } from "react";

interface Props {
  time: number;
}

const Home: NextPage<Props> = (props) => {
  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const newEvent = randomWords({ exactly: 3, join: "-" });
  const res = await fetch(`${process.env.APP_URL}/api/events/${newEvent}`, {
    method: "PUT",
    body: JSON.stringify({
      eventId: newEvent,
      eventName: "",
      startTime: Date.now().toString(),
      endTime: Date.now().toString(),
    }),
  });
  return {
    redirect: {
      permanent: false,
      destination: `/${newEvent}`,
    },
    props: {},
  };
};

export default Home;
