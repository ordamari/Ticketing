import { useEffect } from "react";
import { useRequest } from "../../../common/hooks/useRequest";
import { Methods } from "../../../common/enums/methods.enum";
import { useRouter } from "next/router";
const SIGNOUT_ENDPOINT = "users/signout";

function Signout() {
  const router = useRouter();
  const [signout, errors] = useRequest(SIGNOUT_ENDPOINT, Methods.POST, () => {
    router.push("/");
  });

  useEffect(() => {
    signout();
  }, []);

  return <div>Signing out...</div>;
}

export default Signout;
