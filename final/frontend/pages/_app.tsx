import "../styles/App.scss";
import type { AppProps } from "next/app";
import { Layout } from "~components/Layout";
import { createContext } from "react";
import { useSession } from "~utils/useSession";
import { Spinner } from "reactstrap";

export const SessionContext = createContext<any>(null);

function MyApp({ Component, pageProps }: AppProps) {
  const [user, userLoading, updateSession, logout] = useSession();
  if (userLoading) return <Spinner />;
  return (
    <SessionContext.Provider value={{ user, updateSession, logout }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionContext.Provider>
  );
}

export default MyApp;
