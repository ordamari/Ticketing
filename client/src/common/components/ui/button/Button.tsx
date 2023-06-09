import Link from "next/link";
import { Icons } from "../../../enums/icons.enum";
import Icon from "../../Icon/Icon";
import classes from "./button.module.scss";

type PrivateProps = {
  children: React.ReactNode;
  className?: string;
  icon?: Icons;
  onClick?: (ev: any) => void | Promise<void>;
  href?: string;
  disabled?: boolean;
  asDiv?: boolean;
  style?: React.CSSProperties;
};

function Button({
  children,
  className,
  href,
  icon,
  asDiv,
  ...restProps
}: PrivateProps) {
  if (asDiv) {
    return (
      <div
        className={`${classes.button} ${className} ${icon ? classes.icon : ""}`}
      >
        {icon && <Icon icon={icon} />}
        {children}
      </div>
    );
  }
  if (href) {
    return (
      <Link
        href={href}
        className={`${classes.button} ${className} ${icon ? classes.icon : ""}`}
        {...restProps}
      >
        {icon && <Icon icon={icon} />}
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`${classes.button} ${className} ${icon ? classes.icon : ""}`}
      {...restProps}
    >
      {icon && <Icon icon={icon} />}
      {children}
    </button>
  );
}

export default Button;
