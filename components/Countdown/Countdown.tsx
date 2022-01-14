import { NextPage } from "next";
import styles from "./Countdown.module.css";
type Props = {
  hours: string;
  minutes: string;
  seconds: string;
  big: boolean;
};
import { useTheme } from "../ThemeProvider/ThemeProvider";

const Countdown: NextPage<Props> = ({ hours, minutes, seconds, big }) => {
  const { primary, secondary, accent } = useTheme();
  return (
    <div
      className={big ? styles.bigCountdown : styles.countdown}
      style={{ color: accent }}
    >
      <section>
        <p>{hours}</p>
        <small style={{ color: secondary }}>Hours</small>
      </section>
      <span>:</span>
      <section>
        <p>{minutes}</p>
        <small style={{ color: secondary }}>Minutes</small>
      </section>
      <span>:</span>
      <section>
        <p>{seconds}</p>
        <small style={{ color: secondary }}>Seconds</small>
      </section>
    </div>
  );
};

export default Countdown;
