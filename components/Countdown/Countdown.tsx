import { NextPage } from "next";
import styles from "./Countdown.module.css";
type Props = {
  hours: string;
  minutes: string;
  seconds: string;
};

const Countdown: NextPage<Props> = (props) => {
  return (
    <div className={styles.countdown}>
      <section>
        <p>{props.hours}</p>
        <small>Hours</small>
      </section>
      <span>:</span>
      <section>
        <p>{props.minutes}</p>
        <small>Minutes</small>
      </section>
      <span>:</span>
      <section>
        <p>{props.seconds}</p>
        <small>Seconds</small>
      </section>
    </div>
  );
};

export default Countdown;
