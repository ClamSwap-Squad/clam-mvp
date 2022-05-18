import { truncate } from "lodash";
import { WelcomeUserBack } from "./WelcomeUserBack";

export const onSwapTxn = (updateCharacter) => {
  updateCharacter({
    name: "tanja",
    action: "bank.process_transaction.text",
    button: false,
  });
};


export const onSwapSuccess = (updateCharacter) => {
  updateCharacter({
    name: "tanja",
    action: "bank.swap_success.text",
    button: false,
  });
};

export const onSwapError = (updateCharacter) => {
  updateCharacter({
    name: "tanja",
    action: "bank.swap_error.text",
    button: false,
  });
};
