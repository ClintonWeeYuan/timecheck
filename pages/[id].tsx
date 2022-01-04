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

export interface EventType {
  name: string;
  id: string;
  startTime: string;
  endTime: string;
  alert?: string;
}

async function fetcher(endpoint: string) {
  const res = await fetch(endpoint, { method: "GET" });
  return res.json();
}

const Details: NextPage<Props> = (props) => {
  const [time, setTime] = useState<number>(Date.now());
  const [event, setEvent] = useState<EventType>({
    name: props.event.eventName.S,
    id: props.event.eventId.S,
    startTime: props.event.startTime.N,
    endTime: props.event.endTime.N,
  });

  //Gets from Database every 2 seconds
  const { data, error } = useSWR(
    `${process.env.APP_URL}/api/events/${props.event.eventId.S}`,
    fetcher,
    { fallbackData: props.event, refreshInterval: 2000 }
  );

  //Updating the Event Object based on database
  useEffect(() => {
    if (data.alert) {
      setEvent({
        name: data.eventName.S,
        id: data.eventId.S,
        startTime: data.startTime.N,
        endTime: data.endTime.N,
        alert: data.alert.S,
      });
    } else {
      setEvent({
        name: data.eventName.S,
        id: data.eventId.S,
        startTime: data.startTime.N,
        endTime: data.endTime.N,
      });
    }
  }, [data]);

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
  return <MainPage event={event} time={time} />;
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
