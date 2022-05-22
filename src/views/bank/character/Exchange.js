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

export const onApproveTxn = (updateCharacter) => {
  updateCharacter({
    name: "tanja",
    action: "bank.process_approve_transaction.text",
    button: false,
  });
};

export const onApproveSuccess = (updateCharacter) => {
  updateCharacter({
    name: "tanja",
    action: "bank.approve_success.text",
    button: false,
  });
};

export const onApproveError = (updateCharacter) => {
  updateCharacter({
    name: "tanja",
    action: "bank.approve_error.text",
    button: false,
  });
};
