import type { AppProps } from "next/app";
import "../assets/styles/globals.scss";
import { useOnLoad } from "../common/hooks/useOnLoad";

export default function App({ Component, pageProps }: AppProps) {
  useOnLoad();
  return (
    <div className="app">
      <Component {...pageProps} />
    </div>
  );
}
