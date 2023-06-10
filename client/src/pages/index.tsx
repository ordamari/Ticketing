import { User } from "../common/types/user.type";
import buildClient from "../api/build-client";

type PrivateProps = {
  currentUser: User | null;
};
function Home({ currentUser }: PrivateProps) {
  console.log(currentUser);

  return <div>Welcome to Next.js!</div>;
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
