import { NextPage } from "next";
import styles from "./Countdown.module.css";
type Props = {
  hours: string;
  minutes: string;
  seconds: string;
};

const Countdown: NextPage<Props> = ({ hours, minutes, seconds }) => {
  return (
    <div className={styles.countdown}>
      <section>
        <p>{hours}</p>
        <small>Hours</small>
      </section>
      <span>:</span>
      <section>
        <p>{minutes}</p>
        <small>Minutes</small>
      </section>
      <span>:</span>
      <section>
        <p>{seconds}</p>
        <small>Seconds</small>
      </section>
    </div>
  );
};

export default Countdown;
