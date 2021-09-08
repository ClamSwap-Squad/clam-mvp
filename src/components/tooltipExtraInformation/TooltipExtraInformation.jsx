import { Dropdown } from "@pancakeswap-libs/uikit";
import { InfoIcon } from "@pancakeswap-libs/uikit";

import "./index.scss";

export const TooltipExtraInformation = ({ text }) => (
  <div className="tooltipContent">
    <Dropdown
      target={<InfoIcon color="#757575" width="8px" className="cursor-pointer" />}
      position="top-right"
    >
      <span className="text-white">{text}</span>
    </Dropdown>
  </div>
);
