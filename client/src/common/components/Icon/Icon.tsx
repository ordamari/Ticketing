import { Icons } from "../../enums/icons.enum";
import AngleDown from "./svgs/AngleDown.svg";
import AngleUp from "./svgs/AngleUp.svg";

type PrivateProps = {
  className?: string;
  style?: React.CSSProperties;
  icon: Icons;
};
function Icon({ icon, className = "", style = {} }: PrivateProps) {
  switch (icon) {
    case Icons.AngleDown:
      return <AngleDown className={className} style={style} />;
    case Icons.AngleUp:
      return <AngleUp className={className} style={style} />;
  }
}
export default Icon;
