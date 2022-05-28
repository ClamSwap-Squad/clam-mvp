import React, { useEffect, useState } from "react";
import { connect } from "redux-zero/react";
import { formatUnits } from "@ethersproject/units";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

import {
  getClamValueInShellToken,
  getPearlValueInShellToken,
  harvestClamForShell,
  getClamIncubationTime,
} from "../../web3/clam";

import { getCurrentBlockTimestamp } from "../../web3";

import "./index.scss";

import { actions } from "../../store/redux";
import { Modal, useModal } from "components/Modal";
import { ClamsSorting } from "components/clamsSorting";
import { getSortedClams } from "utils/clamsSort";

import { formatNumberToLocale } from "utils/formatNumberToLocale";

import {
  harvestClamProcessing,
  harvestClamSpeak,
  harvestCongrats,
  harvestError,
  harvestChooseClams,
  harvestNoClamsAvailable,
} from "./character/HarvestClam";

import ClamItem from './ClamItem';


const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  return [`${hours}h`, `${minutes}m`, `${seconds}s`].filter((item) => item[0] !== "0").join(" ");
};

const ClamHarvestModal = ({
  setModalToShow,
  account: { address, clamBalance, ...stateAccount },
  updateCharacter,
  updateAccount,
  updateClams,
  sorting: {
    shop: { clams: clamsSortOrder },
  },
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [clams, setClams] = useState([]);
  const [message, setMessage] = useState("Loading...");
  const [pearlValueInShellToken, setPearlValueInShellToken] = useState("0");

  const { isShowing, toggleModal } = useModal({ show: true });

  const harvestClam = async (tokenId, shell) => {
    toggleModal();
    // character speaks
    console.log(shell);
    harvestClamSpeak({ updateCharacter, setModalToShow, shell: shell }, async () => {
      try {
        harvestClamProcessing({ updateCharacter });
        await harvestClamForShell(tokenId, address);
        await updateClams();
        harvestCongrats({ updateCharacter, setModalToShow, shell: shell }); // character speaks
        setModalToShow(null);
      } catch (e) {
        console.error(e);
        updateAccount({ error: e.message });
        harvestError({ updateCharacter }); // character speaks
      }
    });
  };

  const closeModal = () => {
    toggleModal();
    setModalToShow(null);
  };

  useEffect(async () => {
    try {
      setIsLoading(true);
      const incubationtime = await getClamIncubationTime();

      if (+clamBalance > 0) {
        const currentBlockTimestamp = await getCurrentBlockTimestamp();

        const filteredClams = stateAccount.clams.filter(
          ({ clamDataValues: { pearlProductionCapacity, pearlsProduced, birthTime } }) => {
            return (
              +pearlsProduced < +pearlProductionCapacity &&
              currentBlockTimestamp > +birthTime + +incubationtime
            );
          }
        );

        setClams(filteredClams);

        if (filteredClams.length > 0) {
          setMessage(``);
          harvestChooseClams({ updateCharacter, setModalToShow }); // character speaks
        } else {
          const hours = formatDuration(+incubationtime);
          setMessage(
            `None of your clams are able to be harvested.
           They must be either alive or be past the ${hours} incubation period once they have been farmed.`
          );
          harvestNoClamsAvailable({ updateCharacter, setModalToShow, hours }); // character speaks
        }

        setIsLoading(false);
      } else {
        // clam balance is zero
        const hours = formatDuration(+incubationtime);
        harvestNoClamsAvailable({ updateCharacter, setModalToShow, hours }); // character speaks
        setIsLoading(false);
      }

      setPearlValueInShellToken(await getPearlValueInShellToken());
    } catch (error) {
      console.log({ error });
    }
  }, [address, clamBalance]);

  return (
    <div className="HarvestModal">
      <Modal isShowing={isShowing} onClose={closeModal}>
        {isLoading ? (
          <div className="flex justify-center">
            <h1>Loading ...</h1>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          <div>
            {clams.length && !isLoading ? (
              <>

                <div className="div_lg">
                  <div className="ClamDeposit p-2">
                    <div>
                      <h3 className="heading">{message}</h3>
                      <div className="flex flex-row justify-center text-center gap-6 mb-3">
                        <h1 className="text-gray-600 font-aristotelica-bold text-3xl pt-3">Choose a Clam</h1>
                        <ClamsSorting page="shop" textSize="sm" />
                      </div>
                      <div className="max-h-160 overflow-y-auto grid md:grid-cols-4 grid-cols-1 gap-4 flex-2 pt-3">
                        {getSortedClams(clams, clamsSortOrder.value, clamsSortOrder.order).map(
                          (clam, i) => (
                            <ClamItem
                              key={i}
                              clam={clam}
                              harvestClam={harvestClam}
                              pearlValueInShellToken={pearlValueInShellToken}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="div_sm">
                  <div className="ClamDeposit">
                    <div>
                      <h3 className="heading">{message}</h3>
                      <div className="text-center gap-6 mb-3">
                        <h1 className="text-gray-600 font-aristotelica-bold text-3xl pt-3">Choose a Clam</h1>
                        <ClamsSorting page="shop" textSize="sm" />
                      </div>
                      <div className="overflow-y-auto grid md:grid-cols-4 grid-cols-2 gap-2 flex-2 pt-3">
                        {getSortedClams(clams, clamsSortOrder.value, clamsSortOrder.order).map(
                          (clam, i) => (
                            <ClamItem
                              key={i}
                              clam={clam}
                              harvestClam={harvestClam}
                              pearlValueInShellToken={pearlValueInShellToken}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full bg-white shadow-md rounded-xl text-center text-2xl p-5 text-black">
                You&#39;ve got no clams ready for harvest at the moment
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const mapToProps = (store) => store;
export default connect(mapToProps, actions)(ClamHarvestModal);
