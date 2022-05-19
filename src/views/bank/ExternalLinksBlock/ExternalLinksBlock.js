import React from "react";

import { CONNECT_WALLET_TIP } from "constants/ui";
import { TokenExchange } from "components/tokenExchange";

import { Modal, useModal } from "components/Modal";

export const ExternalLinksBlock = ({ totalTVL, harvestAllPools, toggleModal }) => (
  <div className="flex">
    <div className="mr-2 btn glass drop-shadow-button btn-unclickable">TVL: {totalTVL}</div>
    <TokenExchange />
    <div data-tip={CONNECT_WALLET_TIP} className={harvestAllPools ? "" : "tooltip"}>
      <button
        className="ml-2 btn btn-secondary drop-shadow-button"
        onClick={harvestAllPools}
        disabled={!harvestAllPools}
      >
        Harvest All Rewards
      </button>
      <button className="btn btn-info" onClick={toggleModal} disabled={!harvestAllPools}>
        Boost Rewards
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block w-6 h-6 ml-2 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </button>
    </div>
  </div>
);
