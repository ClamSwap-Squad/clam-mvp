import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "../index.scss";
import "./DepositClamCard.scss";

export const DepositClamCard = ({
  onClick,
  pearlProductionPrice,
  minPearlProductionTime,
  maxPearlProductionTime,
}) => {
  return (
    <button className="FarmItem depositClamCard md:mt-0" onClick={onClick}>
      <div className="depositClamCardItem item1">
        <div className="cardContent">
          <FontAwesomeIcon className="cardIcon" icon={faPlus} />
          <span className="cardText">Deposit Clam</span>
        </div>
      </div>
      <div className="depositClamCardItem item2 text-xs xl:text-sm p-4">
        <ul>
          <li className="flex justify-between pb-2">
            <span className="text-left">Pearl production time:</span>
            <span className="text-right">
              {minPearlProductionTime}-{maxPearlProductionTime} hrs
            </span>
          </li>
          <li className="flex justify-between pb-2">
            <span className="text-left">Avg Pearl ROI:</span>
            <span className="text-right">2x</span>
          </li>
        </ul>
      </div>
    </button>
  );
};
