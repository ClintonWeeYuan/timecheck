import type { NextPage } from "next";

import MainPage from "../components/MainPage/MainPage";

import { useEffect, useState } from "react";

interface Props {
  time: number;
}

const Home: NextPage<Props> = (props) => {
  const [time, setTime] = useState<number>(Date.now());
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
    <div>
      <MainPage time={props.time} />
    </div>
  );
};

export default Home;
