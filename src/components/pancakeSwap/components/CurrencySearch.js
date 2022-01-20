import React from "react";
import { Text } from "@pancakeswap-libs/uikit";
import cn from "classnames";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DEFAULT_TOKEN_LIST } from "../constants/defaultTokenList";

export const CurrencySearch = (props) => {
  const { currency, onCurrencySelect, otherCurrency, topSearch } = props;

  const currenciesList = DEFAULT_TOKEN_LIST.map((currentCurrency) => (
    <li key={currentCurrency.address}>
      <button
        className="btn btn-ghost p-2 btn-lg flex flex-row justify-start items-center"
        disabled={currentCurrency.symbol === currency.symbol || currentCurrency.symbol === otherCurrency.symbol}
        onClick={() => onCurrencySelect(currentCurrency)}
      >
        <div className="avatar mr-2">
          <div className="rounded-full w-5 h-5">
            <img src={currentCurrency.logoURI} />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <Text bold>{currentCurrency.symbol}</Text>
          <Text className="text-xs">{currentCurrency.name}</Text>
        </div>
      </button>
    </li>
  ));

  return (
    <div className={cn("dropdown w-[55px]", { "dropdown-top": topSearch })}>
      <div tabIndex="0" className="m-1 flex-col items-start">
        <span className="font-aristotelica-bold">{currency?.symbol}</span>
        <div className="avatar items-center cursor-pointer hover:bg-gray-200 p-1 rounded-md">
          <div className="rounded-full w-5 h-5">
            <img src={currency.logoURI} />
          </div>
          <FontAwesomeIcon className="ml-1" icon={faCaretDown} size="xs" />
        </div>
      </div>
      <ul tabIndex="0" className="shadow menu dropdown-content bg-base-100 overflow-auto w-52 h-64">
        {currenciesList}
      </ul>
    </div>
  );
};
