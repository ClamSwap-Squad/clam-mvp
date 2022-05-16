import React, {useState, useEffect} from "react";
import { Modal, useModal } from "components/Modal";
import { Onramper } from "components/tokenExchange/Onramper";
import { Exchange } from "components/tokenExchange/exchange-tab";
import cn from "classnames";


const TABS = {
  buy: "buy",
  exchange: "exchange",
};

export const ExchangeToken = ({address}) => {

  const [selectedTab, setSelectedTab] = useState(TABS.buy);
  const isBuy = selectedTab === TABS.buy;
  const isExchange = selectedTab === TABS.exchange;

  return (
    <>
      <div className="bg-white p-3 pt-5 rounded-xl">
        <div className="flex flex-col items-center ">
          <div className="tabs">
            <a
              className={cn("tab tab-bordered font-aristotelica-bold text-xl", {
                "tab-active": isBuy,
              })}
              onClick={() => setSelectedTab(TABS.buy)}
            >
              Buy BNB
            </a>
            <a
              className={cn("tab tab-bordered font-aristotelica-bold text-xl", {
                "tab-active": isExchange,
              })}
              onClick={() => setSelectedTab(TABS.exchange)}
            >
              EXCHANGE
            </a>
          </div>
          <div className="mt-4 w-full">
            {isBuy && (
              <div className="exchange-tabs-content">
                <div className="h-full w-full relative">
                  <Onramper />
                  <div className="w-full h-full absolute top-0 z-999 bg-gray-200 bg-opacity-90 flex items-center justify-center text-2xl">
                    Coming Soon
                  </div>
                </div>
              </div>
            )}
            {isExchange && <Exchange address={address} />}
          </div>
        </div>
      </div>
    </>
  )
};
