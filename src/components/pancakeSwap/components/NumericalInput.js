import { escapeRegExp } from "../utils";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

export const NumericalInput = (props) => {
  const { value, onUserInput } = props;
  const enforcer = (nextUserInput) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  return (
    <input
      className="input input-ghost text-lg w-8/12"
      type="text"
      placeholder="0.0"
      value={value}
      onChange={(event) => {
        // replace commas with periods, because we exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, "."));
      }}
      pattern="^[0-9]*[.,]?[0-9]*$"
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  );
};
