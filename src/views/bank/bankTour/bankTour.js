import React, { useEffect, useState, useRef } from "react";
import { useAction } from "redux-zero/react";
import { useElemRect } from "@reactour/utils";
import { Mask } from "@reactour/mask";

import { actions } from "store/redux";
import { useWeb3Modal } from "components/Web3ProvidersModal";

import { BankTourSpeechFlow } from "./bankTourSpeechFlow";
const actionCreators = actions();
const updateCharacterAC = actionCreators.updateCharacter;

export const BankTour = ({ info, setInfo, state }) => {
  const [tour, setTour] = useState();
  const [maskedElement, setMaskedElement] = useState();
  const isConnected = useRef(state.isConnected);
  const updateCharacter = useAction(updateCharacterAC);
  const { onConnect: connectWallet } = useWeb3Modal(state);

  const setShownElement = (elementId) => {
    const selectedElement = document.getElementById(elementId);
    setMaskedElement(selectedElement);
  };
  const sizes = useElemRect(maskedElement, state.gemBalance);
  const handleClickHighlighted = () => {
    if (info?.step === "3") {
      tour.step4();
    }
  };

  useEffect(() => {
    isConnected.current = state.isConnected;
  }, [state.isConnected]);

  useEffect(() => {
    if (state.isConnected && info?.step === "1") {
      tour.step2();
    }
  }, [state.isConnected, info, tour]);

  useEffect(() => {
    if (!tour) {
      const tour = new BankTourSpeechFlow(updateCharacter, setShownElement, connectWallet, setInfo, isConnected);
      setTour(tour);
      if (!info) {
        tour.start();
      } else {
        setTimeout(() => {
          tour.proceed(info.step);
        }, [700]);
      }
    }
  }, []);

  return info && maskedElement ? (
    <Mask
      sizes={sizes}
      onClickHighlighted={handleClickHighlighted}
      highlightedAreaClassName={`${
        ["3", "9", "11_1", "12"].includes(info?.step) ? "!block cursor-pointer" : ""
      }`}
    />
  ) : null;
};
