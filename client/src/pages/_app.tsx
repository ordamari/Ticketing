import type { AppProps } from "next/app";
import "../assets/styles/globals.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps} />;
    </div>
  );
}
