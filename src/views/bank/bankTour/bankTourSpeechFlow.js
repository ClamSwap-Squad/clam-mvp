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
    this.setShownElement("TokenExchangeButton");

    this.updateCharacter({
      name: "tanja",
      action: "bankTour.step3.text",
      button: {},
    });
  }

  step4() {
    const currentAction = () => {
      this.setInfo({ step: "4" });
      this.setShownElement("BuyBNBTabButton");
      this.updateCharacter({
        name: "tanja",
        action: "bankTour.step4.text",
        button: {
          text: BUTTONS.bankTour.step4.next,
          alt: {
            action: "cb",
            destination: () => {
              this.step5();
            },
          },
        },
      });
    };

    if (document.getElementById("BuyBNBTabButton")) {
      currentAction();
    } else {
      document.getElementById("TokenExchangeButton").click();
      setTimeout(() => {
        currentAction();
      }, 300);
    }
  }

  step5() {
    const currentAction = () => {
      this.setInfo({ step: "5" });
      this.setShownElement("ExchangeTabButton");
      this.updateCharacter({
        name: "tanja",
        action: "bankTour.step5.text",
        button: {
          text: BUTTONS.bankTour.step5.next,
          alt: {
            action: "cb",
            destination: () => {
              this.step6();
            },
          },
        },
      });
    };

    if (document.getElementById("ExchangeTabButton")) {
      currentAction();
    } else {
      document.getElementById("TokenExchangeButton").click();
      setTimeout(() => {
        currentAction();
      }, 300);
    }
  }

  step6() {
    const currentAction = () => {
      this.setInfo({ step: "6" });
      this.setShownElement("ExchangeLinksBlock");
      this.updateCharacter({
        name: "tanja",
        action: "bankTour.step6.text",
        button: {
          text: BUTTONS.bankTour.step6.next,
          alt: {
            action: "cb",
            destination: () => {
              document.getElementById("TokenExchangeButton").click();
              this.step7_1();
            },
          },
        },
      });
    };

    if (document.getElementById("ExchangeLinksBlock")) {
      currentAction();
    } else if (
      document.getElementById("ExchangeTabButton") &&
      !document.getElementById("ExchangeLinksBlock")
    ) {
      document.getElementById("ExchangeTabButton").click();
      setTimeout(() => {
        currentAction();
      }, 300);
    } else {
      document.getElementById("TokenExchangeButton").click();
      setTimeout(() => {
        document.getElementById("ExchangeTabButton").click();
        setTimeout(() => {
          currentAction();
        }, 300);
      }, 300);
    }
  }

  step7_1() {
    this.setInfo({ step: "7_1" });
    this.setShownElement("PoolItem-0");

    this.updateCharacter({
      name: "tanja",
      action: "bankTour.step7_1.text",
      button: {
        text: BUTTONS.bankTour.step7_1.next,
        alt: {
          action: "cb",
          destination: () => {
            this.step7_2();
          },
        },
      },
    });
  }

  step7_2() {
    this.updateCharacter({
      name: "tanja",
      action: "bankTour.step7_2.text",
      button: {
        text: BUTTONS.bankTour.step7_2.next,
        alt: {
          action: "cb",
          destination: () => {
            this.step7_3();
          },
        },
      },
    });
  }

  step7_3() {
    this.updateCharacter({
      name: "tanja",
      action: "bankTour.step7_3.text",
      button: {
        text: BUTTONS.bankTour.step7_3.next,
        alt: {
          action: "cb",
          destination: () => {
            this.step8();
          },
        },
      },
    });
  }

  step8() {
    if (!document.getElementById("PoolDepositTab")) {
      document.getElementById("PoolItem-0").click();
    }
    this.setInfo({ step: "8" });

    setTimeout(() => {
      this.setShownElement("PoolDepositTab");
      this.updateCharacter({
        name: "tanja",
        action: "bankTour.step8.text",
        button: {
          text: BUTTONS.bankTour.step8.next,
          alt: {
            action: "cb",
            destination: () => {
              this.step9();
            },
          },
        },
      });
    }, 300);
  }

  step9() {
    const currentAction = () => {
      this.setInfo({ step: "9" });
      this.setShownElement("DepositGemButton");
      this.updateCharacter({
        name: "tanja",
        action: "bankTour.step9.text",
        button: {
          text: BUTTONS.bankTour.step9.next,
          alt: {
            action: "cb",
            destination: () => {
              this.step10();
            },
          },
        },
      });
    };

    if (document.getElementById("DepositGemButton")) {
      currentAction();
    } else {
      document.getElementById("PoolItem-0").click();
      setTimeout(() => {
        currentAction();
      }, 300);
    }
  }

  step10() {
    const currentAction = () => {
      this.setInfo({ step: "10" });
      this.setShownElement("HarvestRewardsInfo");
      this.updateCharacter({
        name: "tanja",
        action: "bankTour.step10.text",
        button: {
          text: BUTTONS.bankTour.step10.next,
          alt: {
            action: "cb",
            destination: () => {
              this.step11_1();
            },
          },
        },
      });
    };

    if (document.getElementById("HarvestRewardsInfo")) {
      currentAction();
    } else {
      document.getElementById("PoolItem-0").click();
      setTimeout(() => {
        currentAction();
      }, 300);
    }
  }

  step11_1() {
    const currentAction = () => {
      this.setInfo({ step: "11_1" });
      this.setShownElement("PoolHarvestButton");
      this.updateCharacter({
        name: "tanja",
        action: "bankTour.step11_1.text",
        button: {
          text: BUTTONS.bankTour.step11_1.next,
          alt: {
            action: "cb",
            destination: () => {
              this.step11_2();
            },
          },
        },
      });
    };

    if (document.getElementById("PoolHarvestButton")) {
      currentAction();
    } else {
      document.getElementById("PoolItem-0").click();
      setTimeout(() => {
        currentAction();
      }, 300);
    }
  }

  step11_2() {
    this.updateCharacter({
      name: "tanja",
      action: "bankTour.step11_2.text",
      button: {
        text: BUTTONS.bankTour.step11_2.next,
        alt: {
          action: "cb",
          destination: () => {
            this.step12();
          },
        },
      },
    });
  }

  step12() {
    const currentAction = () => {
      this.setInfo({ step: "12" });
      this.setShownElement("PoolBoostRewardsButton");
      this.updateCharacter({
        name: "tanja",
        action: "bankTour.step12.text",
        button: {
          text: BUTTONS.bankTour.step12.next,
          alt: {
            action: "cb",
            destination: () => {
              this.step13();
            },
          },
        },
      });
    };

    if (document.getElementById("PoolBoostRewardsButton")) {
      currentAction();
    } else {
      document.getElementById("PoolItem-0").click();
      setTimeout(() => {
        currentAction();
      }, 300);
    }
  }

  step13() {
    this.setInfo({ step: "13" });
    this.setShownElement(null);
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
}
