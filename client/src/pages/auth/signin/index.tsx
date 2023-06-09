import { useState } from "react";
import Input from "../../../common/components/ui/input/Input";
import AuthCredentialsForm from "../../../features/auth/components/AuthCredentialsForm";
import useTranslation from "../../../common/hooks/useTranslation";

function Signin() {
  const t = useTranslation();
  return (
    <AuthCredentialsForm
      title={t("auth.signin")}
      onSubmit={(email, password) => {
        console.log(email, password);
      }}
    />
  );
}
export default Signin;
