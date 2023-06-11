import type { AppProps } from "next/app";
import "../assets/styles/globals.scss";
import { useOnLoad } from "../common/hooks/useOnLoad";
import buildClient from "../api/build-client";
import { User } from "../common/types/user.type";
import Navbar from "../common/components/navbar/Navbar";

type PrivateProps = {
  currentUser: User | null;
} & AppProps;

export default function App({
  Component,
  pageProps,
  currentUser,
}: PrivateProps) {
  useOnLoad();
  return (
    <div className="app">
      <Navbar currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
}

App.getInitialProps = async (appContext) => {
  try {
    const context = appContext.ctx;
    const client = buildClient(context);
    const { data } = await client.get("/api/users/current_user");
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(context);
    }
    return {
      pageProps,
      ...data,
    } as PrivateProps;
  } catch {
    return {
      pageProps: {},
      currentUser: null,
    } as PrivateProps;
  }
};
