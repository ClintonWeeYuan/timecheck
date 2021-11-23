import { NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "./Analog.module.css";

const Analog: NextPage = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);
  return (
    <div className={styles.clock}>
      <div
        className={styles.hour}
        style={{
          transform: `rotateZ(${time.getHours() * 30}deg)`,
        }}
      />
      <div
        className={styles.minute}
        style={{
          transform: `rotateZ(${time.getMinutes() * 6}deg)`,
        }}
      />
      <div
        className={styles.second}
        style={{
          transform: `rotateZ(${time.getSeconds() * 6}deg)`,
        }}
      />
      <span className={styles.twelve}>12</span>
      <span className={styles.one}>1</span>
      <span className={styles.two}>2</span>
      <span className={styles.three}>3</span>
      <span className={styles.four}>4</span>
      <span className={styles.five}>5</span>
      <span className={styles.six}>6</span>
      <span className={styles.seven}>7</span>
      <span className={styles.eight}>8</span>
      <span className={styles.nine}>9</span>
      <span className={styles.ten}>10</span>
      <span className={styles.eleven}>11</span>
    </div>
  );
};
export default Analog;
