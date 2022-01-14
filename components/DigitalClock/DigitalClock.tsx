import { NextPage } from "next";
import { format } from "date-fns";
import { useTime } from "../TimeProvider/TimeProvider";
import { time } from "console";
import styles from "./DigitalClock.module.css";
import { useTheme } from "../ThemeProvider/ThemeProvider";
import { useEffect, useState } from "react";

interface Props {
  size?: string;
  ampm: boolean;
}
const DigitalClock: NextPage<Props> = (props) => {
  const { primary, secondary, accent } = useTheme();
  const time = useTime();

  const [ampm, setAmpm] = useState(props.ampm);

  return (
    <div className={styles.clock} style={{ color: accent }}>
      <section style={{ padding: "10px" }}>
        <p>{format(time, props.ampm ? "hh" : "HH")}</p>
      </section>
      <span>:</span>
      <section>
        <p>{format(time, "mm")}</p>
      </section>
      <span>:</span>
      <section>
        <p>{format(time, "ss")}</p>
      </section>
      {props.ampm && (
        <section>
          <p>{format(time, "aaaa")}</p>
        </section>
      )}
    </div>
  );
};

export default DigitalClock;
