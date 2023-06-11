import { User } from "../common/types/user.type";
import buildClient from "../api/build-client";
import useTranslation from "../common/hooks/useTranslation";

type PrivateProps = {
  currentUser: User | null;
};
function Home({ currentUser }: PrivateProps) {
  const t = useTranslation();

  return (
    <div>
      <h1>{currentUser ? t("global.welcome") : t("global.notSignedIn")}</h1>
    </div>
  );
}

Home.getInitialProps = async (context) => {
  try {
    const client = buildClient(context);
    const { data } = await client.get("/api/users/current_user");
    return data as PrivateProps;
  } catch {
    return {
      currentUser: null,
    } as PrivateProps;
  }
};

export default Home;
