import { useState } from "react";
import Input from "../../../common/components/ui/input/Input";
import AuthCredentialsForm from "../../../features/auth/components/AuthCredentialsForm";
import useTranslation from "../../../common/hooks/useTranslation";
import { useRequest } from "../../../common/hooks/useRequest";
import { Methods } from "../../../common/enums/methods.enum";
import { useRouter } from "next/router";
import Errors from "../../../common/components/ui/errors/Errors";
const SIGNIN_ENDPOINT = "users/signin";
function Signin() {
  const t = useTranslation();
  const router = useRouter();
  const [signIn, errors] = useRequest(SIGNIN_ENDPOINT, Methods.POST, () => {
    router.push("/");
  });

  return (
    <div className="flex column gap-large">
      <AuthCredentialsForm title={t("auth.signin")} onSubmit={signIn} />
      <Errors errors={errors} />
    </div>
  );
}
export default Signin;
