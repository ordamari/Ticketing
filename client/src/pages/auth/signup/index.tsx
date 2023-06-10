import { useRouter } from "next/router";
import Errors from "../../../common/components/ui/errors/Errors";
import { Methods } from "../../../common/enums/methods.enum";
import { useRequest } from "../../../common/hooks/useRequest";
import useTranslation from "../../../common/hooks/useTranslation";
import AuthCredentialsForm from "../../../features/auth/components/AuthCredentialsForm";
const SIGNUP_ENDPOINT = "users/signup";
function Signup() {
  const t = useTranslation();
  const router = useRouter();
  const [signUp, errors] = useRequest(SIGNUP_ENDPOINT, Methods.POST, () => {
    router.push("/");
  });

  return (
    <div className="flex column gap-large">
      <AuthCredentialsForm title={t("auth.signup")} onSubmit={signUp} />
      <Errors errors={errors} />
    </div>
  );
}
export default Signup;
