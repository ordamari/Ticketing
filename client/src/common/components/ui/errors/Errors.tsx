import useTranslation from "../../../hooks/useTranslation";
import { Error } from "../../../types/error.type";
import classes from "./errors.module.scss";

type privateProps = {
  errors: Error[] | null;
  className?: string;
  errorTitle?: string;
};
function Errors({ errors, className = "", errorTitle = "" }: privateProps) {
  const t = useTranslation();
  if (!errors) return null;
  return (
    <div className={`${classes.errors} ${className}`}>
      <p>{errorTitle ? errorTitle : t("global.error")}</p>
      <ul className="">
        {errors.map((error, index) => (
          <li key={index} className="error">
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Errors;
