import { BUTTONS } from "components/characters/constants";
import { WelcomeUserBack } from "../character/WelcomeUserBack";

const STEP_WAY = {
  4: "5",
  5: "6",
  6: "7_1",
  "7_1": "7_2",
  "7_2": "7_3",
  "7_3": "8",
  8: "9",
  9: "10",
  10: "11_1",
  "11_1": "11_2",
  "11_2": "12",
};

export class BankTourSpeechFlow {
  constructor(updateCharacter, setShownElement, connectWallet, setInfo, isConnected) {
    this.updateCharacter = updateCharacter;
    this.setShownElement = setShownElement;
    this.connectWallet = connectWallet;
    this.setInfo = setInfo;
    this.isConnected = isConnected;
  }

  start() {
    this.updateCharacter({
      name: "tanja",
      action: "bankTour.start.text",
      button: {
        text: BUTTONS.bankTour.start.alt,
        alt: {
          action: "cb",
          destination: () => {
            this.cancel();
          },
        },
      },
      buttonAlt: {
        text: BUTTONS.bankTour.start.next,
        alt: {
          action: "cb",
          destination: () => {
            if (this.isConnected.current) {
              this.step2(true);
            } else {
              this.step1();
            }
          },
        },
      },
    });
  }

  cancel() {
    this.updateCharacter({
      name: "tanja",
      action: "bankTour.cancel.text",
      button: {
        text: BUTTONS.bankTour.cancel.next,
        alt: {
          action: "cb",
          destination: () => {
            this.setInfo({ isCompleted: true });
            WelcomeUserBack({ suppressSpeechBubble: true, updateCharacter: this.updateCharacter });
          },
        },
      },
    });
  }

  proceed(step) {
    this.updateCharacter({
      name: "tanja",
      action: "bankTour.proceed.text",
      button: {
        text: BUTTONS.bankTour.proceed.alt,
        alt: {
          action: "cb",
          destination: () => {
            this.cancel();
          },
        },
      },
      buttonAlt: {
        text: BUTTONS.bankTour.proceed.next,
        alt: {
          action: "cb",
          destination: () => {
            this[`step${step}`]();
          },
        },
      },
    });
  }

  step1() {
    this.setInfo({ step: "1" });
    this.setShownElement("connectWalletButton");
    this.updateCharacter({
      name: "tanja",
      action: "bankTour.step1.text",
      restrictReveal: true,
      button: {
        text: BUTTONS.bankTour.step1.alt,
        alt: {
          action: "cb",
          destination: () => {
            window.open(
              "https://coinmarketcap.com/alexandria/article/all-you-need-to-know-to-link-your-metamask-account-to-other-blockchains",
              "_blank"
            );
          },
        },
      },
      buttonAlt: {
        text: BUTTONS.bankTour.step1.next,
        alt: {
          action: "cb",
          destination: () => {
            this.connectWallet();
          },
        },
      },
    });
  }

  step2(alt) {
    this.setInfo({ step: "2" });
    this.setShownElement("NavInfoBlock");
    this.updateCharacter({
      name: "tanja",
      action: alt ? "bankTour.step2Alt.text" : "bankTour.step2.text",
      button: {
        text: BUTTONS.bankTour.step2.next,
        alt: {
          action: "cb",
          destination: () => {
            this.step3();
          },
        },
      },
    });
  }

  step3() {
    this.setInfo({ step: "3" });

    this.updateCharacter({
      name: "tanja",
      action: "bankTour.step3.text",
      button: {},
    });
  }

  step4() {
    this.setInfo({ step: "4" });
    this.updateCharacter({
      name: "tanja",
      action: "bankTour.step4.text",
      button: {
        text: BUTTONS.bankTour.step4.next,
        alt: {
          action: "cb",
          destination: () => {
            this.callStep("5");
          },
        },
      },
    });
  }

  step13() {
    this.setInfo({ step: "13" });

    this.updateCharacter({
      name: "tanja",
      action: "bankTour.step13.text",
      button: {
        text: BUTTONS.bankTour.step13.next,
        alt: {
          action: "cb",
          destination: () => {
            WelcomeUserBack({ suppressSpeechBubble: true, updateCharacter: this.updateCharacter });
            this.setInfo({ isCompleted: true });
          },
        },
      },
    });
  }

  callStep(step) {
    this.setInfo({ step });
    this.updateCharacter({
      name: "tanja",
      action: `bankTour.step${step}.text`,
      button: {
        text: BUTTONS.bankTour[`step${step}`].next,
        alt: {
          action: "cb",
          destination: () => {
            if (step === "12") {
              this.step13();
            } else {
              this.callStep(STEP_WAY[step]);
            }
          },
        },
      },
    });
  }
}
