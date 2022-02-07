import React, { useEffect, useState, useRef } from "react";
import { useAction } from "redux-zero/react";
import { getRect } from "@reactour/utils";
import { Mask } from "@reactour/mask";

import { actions } from "store/redux";
import { useWeb3Modal } from "components/Web3ProvidersModal";

import { BankTourSpeechFlow } from "./bankTourSpeechFlow";
const actionCreators = actions();
const updateCharacterAC = actionCreators.updateCharacter;
const suppressSpeechBubbleAC = actionCreators.suppressSpeechBubbleAction;

export const BankTour = ({ info, setInfo, state }) => {
  const [sizes, setSizes] = useState();
  const [tour, setTour] = useState();
  const isConnected = useRef(state.isConnected);
  const updateCharacter = useAction(updateCharacterAC);
  const hideSpeechBubble = useAction(suppressSpeechBubbleAC);
  const { onConnect: connectWallet } = useWeb3Modal(state);

  const setShownElement = (elementId) => {
    const selectedElement = document.getElementById(elementId);
    const sizes = getRect(selectedElement);
    setSizes(sizes);
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
      const tour = new BankTourSpeechFlow(updateCharacter, hideSpeechBubble, setShownElement, connectWallet, setInfo, isConnected);
      setTour(tour);
      if (!info) {
        tour.start();
      } else {
        setTimeout(() => {
          tour.proceed(info.step);
        }, [1000]);
      }
    }
  }, []);

  return info ? <Mask sizes={sizes} /> : null;
};
