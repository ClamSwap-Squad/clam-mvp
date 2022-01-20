import { NumericalInput } from "./NumericalInput";
import { CurrencySearch } from "./CurrencySearch";

import "../styles.scss";

export const CurrencyInputPanel = (props) => {
  const { value, onUserInput, currency, onCurrencySelect, otherCurrency, topSearch } = props;

  return (
    <div className="currency-input-panel flex flex-row items-end rounded-xl p-2 swap-item-shadow">
      <CurrencySearch
        currency={currency}
        onCurrencySelect={onCurrencySelect}
        otherCurrency={otherCurrency}
        topSearch={topSearch}
      />
      <NumericalInput value={value} onUserInput={onUserInput} />
    </div>
  );
};
