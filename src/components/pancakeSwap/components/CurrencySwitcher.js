import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const CurrencySwitcher = ({ onSwitchTokens }) => {
  return (
    <div className="relative h-[32px] border-b border-gray-200 mb-8">
      <button
        className="absolute btn btn-outline btn-circle btn-sm top-1/2 right-6 text-gray-200 bg-white"
        onClick={onSwitchTokens}
      >
        <FontAwesomeIcon className="text-black" icon={faSync} />
      </button>
    </div>
  );
};
