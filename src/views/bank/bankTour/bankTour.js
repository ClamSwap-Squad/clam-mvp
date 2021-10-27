import React, { useEffect } from "react";
import { useAction } from "redux-zero/react";
import { useTour } from "@reactour/tour";

import { actions } from "store/redux";

const updateCharacterAC = actions().updateCharacter;

const goNextStep = (setCurrentStep) => {
  let currentStep = 1;

  return () => {
    console.log(currentStep);
    setCurrentStep(++currentStep);
  };
};

export const BankTour = () => {
  const { isOpen, currentStep, steps, setIsOpen, setCurrentStep } = useTour();
  const updateCharacter = useAction(updateCharacterAC);

  useEffect(() => {
    const next = goNextStep(setCurrentStep);
    updateCharacter({
      name: "tanja",
      action: "mapGuide.step4.text",
      forceTop: true,
      button: {
        text: "Next",
        alt: {
          action: "cb",
          destination: () => {
            next();
          },
        },
      },
    });
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (currentStep > 5) {
      updateCharacter({
        suppressSpeechBubble: true,
      });
    }
  }, [currentStep]);

  return <></>;
};
