import { NextPage, GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import MainPage from "../components/MainPage/MainPage";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface Props {
  event: {
    endTime: {
      N: "string";
    };
    startTime: {
      N: "string";
    };
    eventName: {
      S: "string";
    };
    eventId: {
      S: "string";
    };
  };
}

async function fetcher(endpoint: string) {
  const res = await fetch(endpoint, { method: "GET" });
  return res.json();
}

const Details: NextPage<Props> = (props) => {
  const [time, setTime] = useState<number>(Date.now());

  const { data, error } = useSWR(
    `${process.env.APP_URL}/api/events/${props.event.eventId.S}`,
    fetcher,
    { fallbackData: props.event }
  );

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
    <MainPage
      time={time}
      eventName={data.eventName.S}
      endTime={data.endTime.N}
      startTime={data.startTime.N}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const res = await fetch(`${process.env.APP_URL}/api/events/${id}`, {
    method: "GET",
  });
  const event = await res.json();

  return {
    props: { event: event },
  };
};
export default Details;
