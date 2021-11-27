import "../styles/globals.css";
import type { AppProps } from "next/app";
import "semantic-ui-css/semantic.min.css";
import { TimeProvider } from "../components/TimeProvider/TimeProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TimeProvider>
      <Component {...pageProps} />
    </TimeProvider>
  );
}

export default MyApp;
