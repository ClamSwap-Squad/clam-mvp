import { BUTTONS } from "components/characters/constants";

export class BankTourSpeechFlow {
  constructor(updateCharacter, hideSpeechBubble, setShownElement, connectWallet, setInfo, isConnected) {
    this.updateCharacter = updateCharacter;
    this.hideSpeechBubble = hideSpeechBubble;
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
            this.hideSpeechBubble(true);
            this.setInfo({ isCompleted: true });
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
          destination: () => {},
        },
      },
    });
  }
}
