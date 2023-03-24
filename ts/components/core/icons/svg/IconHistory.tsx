import React from "react";
import { Svg, Path } from "react-native-svg";
import { SVGIconProps } from "../Icon";

const IconHistory = ({ size, style }: SVGIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.01727 1c-.55229-.00159-1.00129.44483-1.00289.99711l-.01437 4.98081c-.0032 1.10681.89315 2.00576 1.99996 2.00577l5.0144.00007c.55228.00001 1-.4477 1.00001-.99999.00001-.55228-.4477-1-.99999-1.00001l-3.47406-.00005c1.6171-2.40439 4.36158-3.98368 7.47367-3.98368 4.9706 0 9 4.02943 9 8.99997 0 4.9706-4.0294 9-9 9-4.52725 0-8.27529-3.3437-8.90635-7.696-.07924-.5465-.58657-.9254-1.13314-.8461-.54657.0792-.92541.5866-.84616 1.1331C1.89994 18.9125 6.47876 23 12.014 23c6.0751 0 11-4.9248 11-11 0-6.07511-4.9249-10.99997-11-10.99997-3.72803 0-7.02165 1.85484-9.01026 4.68869l.01064-3.68583C3.01597 1.4506 2.56955 1.0016 2.01727 1ZM13 8c0-.55228-.4477-1-1-1s-1 .44772-1 1v5c0 .2652.1054.5196.2929.7071l3 3c.3905.3905 1.0237.3905 1.4142 0 .3905-.3905.3905-1.0237 0-1.4142L13 12.5858V8Z"
      fill="currentColor"
    />
  </Svg>
);

export default IconHistory;
