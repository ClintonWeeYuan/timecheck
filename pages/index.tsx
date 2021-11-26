import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import db from "../db";
import MainClock from "../components/MainClock/MainClock";
import Taskbar from "../components/Taskbar/Taskbar";
import { Grid } from "semantic-ui-react";

interface Props {
  clocks: any;
}

const Home: NextPage<Props> = (props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hello Everyone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid stackable divided columns={2} className={styles.main}>
        <Grid.Column width={12}>
          <MainClock />
        </Grid.Column>

        <Grid.Column width={4}>
          <Taskbar />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch("http://localhost:3000/api/hello", { method: "GET" });
  const clocks = await res.json();

  return {
    props: {
      clocks: clocks,
    },
  };
}

export default Home;
