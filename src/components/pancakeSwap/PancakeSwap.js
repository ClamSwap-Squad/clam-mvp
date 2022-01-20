import React, { useState } from "react";

import { Modal, useModal } from "../Modal";
import { CurrencyInputPanel } from "./components/CurrencyInputPanel";
import { CurrencySwitcher } from "./components/CurrencySwitcher";
import { SwapButton } from "./components/SwapButton";
import { useSwapCallback } from "./hooks/useSwapCallback";

import { DEFAULT_TOKEN_LIST } from "./constants/defaultTokenList";

export const PancakeSwap = (props) => {
  const { isShowing } = props;
  useSwapCallback();
  const [userInput, setUserInput] = useState("");
  const [selectedInputCurrency, setSelectedInputCurrency] = useState(DEFAULT_TOKEN_LIST[0]);
  const [userOutput, setUserOutput] = useState("");
  const [selectedOutputCurrency, setSelectedOutputCurrency] = useState(DEFAULT_TOKEN_LIST[1]);

  const { toggleModal } = useModal();

  const handleInputSelect = (currency) => {
    setSelectedInputCurrency(currency);
  };

  const handleSwitchTokens = () => {
    setSelectedInputCurrency(selectedOutputCurrency);
    setSelectedOutputCurrency(selectedInputCurrency);
  };

  const handleSwapButtonClick = () => {};

  return (
    <Modal
      isShowing={isShowing}
      onClose={toggleModal}
      width={"355px"}
      modalClassName="overflow-y-hidden"
      title="Exchange tokens"
    >
      <div className="flex justify-center">
        <div className="w-full p-4">
          <CurrencyInputPanel
            onUserInput={setUserInput}
            value={userInput}
            currency={selectedInputCurrency}
            onCurrencySelect={handleInputSelect}
            otherCurrency={selectedOutputCurrency}
          />
          <CurrencySwitcher onSwitchTokens={handleSwitchTokens} />
          <CurrencyInputPanel
            onUserInput={setUserOutput}
            value={userOutput}
            currency={selectedOutputCurrency}
            onCurrencySelect={setSelectedOutputCurrency}
            otherCurrency={selectedInputCurrency}
            topSearch
          />
          <SwapButton onClick={handleSwapButtonClick} />
        </div>
      </div>
    </Modal>
  );
};
