import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useForm } from "react-hook-form";
import { getExplorerAddressLink, ChainId } from "@usedapp/core";
import { connect } from "redux-zero/react";
import { formatEther, parseEther } from "@ethersproject/units";
import BigNumber from "bignumber.js";
import "./index.scss";
import ReactTooltip from "react-tooltip";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

import Card from "components/Card";
import ClamUnknown from "assets/img/clam_unknown.png";
import ClamVariety from "assets/img/clam-variety.mp4";
import ClamIcon from "assets/clam-icon.png";
import BnbIcon from "assets/bnb-icon.png";
import ArrowDown from "assets/img/arrow-down.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

import {
  buyClam,
  getPrice,
  checkHasClamToCollect,
  buyClamWithVestedTokens,
  getMinPearlProductionDelay,
  getMaxPearlProductionDelay,
  getClamPriceBnb,
  buyClamWithBnb,
} from "web3/clam";
import { zeroHash } from "constants/constants";
import { infiniteApproveSpending } from "web3/gem";
import { getVestedGem } from "web3/gemLocker";
import { getVestedGem as getVestedGemV2 } from "web3/gemLockerV2";
import { getUsdPriceOfToken } from "web3/pancakeRouter";
import { getMintedThisWeek, getClamsPerWeek, getUpdatedPrice, getUpdatedPearlPrice } from "web3/clamShop";
import { stakePrice } from "web3/pearlFarm";
import { clamShopAddress, gemTokenAddress, BUSD } from "constants/constants";
import {getClamGradesData, getClamGradesList} from "web3/dnaDecoder";
import { actions } from "store/redux";
import { ACTIONS, CATEGORIES } from "constants/googleAnalytics";

import {
  buyClamError,
  buyClamSuccess,
  buyClamProcessing,
  buyClamWithVested,
} from "./character/BuyClam";
import { formatNumber } from "../bank/utils";
import { renderNumber } from "utils/number";
import { formatNumberToLocale } from "utils/formatNumberToLocale";

const Divider = () => (
  <div className="w-full flex flex-col justify-center items-center my-2">
    <div className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
      <img className="h-8 mr-2" src={ArrowDown} />
    </div>
  </div>
);

const ClamBuyModal = ({
  account: { gemBalance, bnbBalance, address, clamToCollect },
  presale: { usersPurchasedClam },
  updateCharacter,
  updateAccount,
  setModalToShow,
}) => {
  const INDIVIDUAL_CAP = 5;
  const disableButton = usersPurchasedClam >= INDIVIDUAL_CAP;

  const [isLoading, setIsLoading] = useState(false);
  const [clamPrice, setClamPrice] = useState(0);
  const [clamUsdPrice, setClamUsdPrice] = useState(0);
  const [lockedGem, setLockedGem] = useState(0);
  const [canBuy, setCanBuy] = useState(false);
  const [mintedThisWeek, setMintedThisWeek] = useState("...");
  const [clamsPerWeek, setClamsPerWeek] = useState("...");
  const [minPearlProductionTime, setMinPearlProductionTime] = useState("...");
  const [maxPearlProductionTime, setMaxPearlProductionTime] = useState("...");
  const [gradesData, setGradesData] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("...");
  const [selectedGradeData, setSelectedGradeData] = useState({});
  const [pearlPrice, setPearlPrice] = useState("...");
  const [clamPriceBnb, setClamPriceBnb] = useState(0);
  const [buyWithGem, setBuyWithGem] = useState(false);
  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      const [_gemPrice, _lockedGemV1, _lockedGemV2, _clamsPerWeek, _mintedThisWeek, _gradesData, _gradesList] = await Promise.all(
        [
          getUsdPriceOfToken(gemTokenAddress, BUSD),
          getVestedGem(),
          getVestedGemV2(),
          getClamsPerWeek(),
          getMintedThisWeek(),
          getClamGradesData(),
          getClamGradesList()
        ]
      );
      console.log(_gradesData);
      console.log(_gradesList);
      setGradesList([..._gradesList].reverse());
      const _grades = [];
      _gradesData.forEach((item, i) => {
        _grades[_gradesList[i]] = {
          price: _gradesData[i][0],
          pearlPrice: _gradesData[i][1],
          minSize: _gradesData[i][2],
          maxSize: _gradesData[i][3],
          minLifespan: _gradesData[i][4],
          maxLifespan: _gradesData[i][5],
          baseShell: _gradesData[i][6]
        }
      });
      console.log(_grades);
      setGradesData(_grades);
      console.log(gradesData);
      console.log(selectedGrade);
      setSelectedGrade("f");
      //const _clamPriceBnb = await getClamPriceBnb(_clamPrice);
      //setClamPrice(_clamPrice);
      setLockedGem(_lockedGemV1 + _lockedGemV2);
      setClamsPerWeek(_clamsPerWeek);
      console.log(clamsPerWeek);
      setMintedThisWeek(_mintedThisWeek);
      //setClamPriceBnb(_clamPriceBnb);

      const getPearlProductionTime = async () => {
        const [minTime, maxTime] = await Promise.all([
          getMinPearlProductionDelay(),
          getMaxPearlProductionDelay(),
        ]);
        //console.log("productionTime: " + minTime + " " + maxTime);
        setMinPearlProductionTime(minTime / 3600);
        setMaxPearlProductionTime(maxTime / 3600);
      };

      getPearlProductionTime();

      //const getPearlPrice = async () => {
      //  const pearlPrice = await stakePrice();
      //  setPearlPrice(formatNumberToLocale(pearlPrice, 2, true));
      //};

      //getPearlPrice();

      //const _clamUsdPrice = new BigNumber(_clamPrice).multipliedBy(_gemPrice).div(1e18); // remove 18 decimals once

      //setClamUsdPrice(_clamUsdPrice);

      if (address) {
        const clamToCollect = await checkHasClamToCollect(address);
        updateAccount({
          clamToCollect: clamToCollect === zeroHash ? null : clamToCollect,
        });
      }
    };
    fetchData();

  }, []);

  useEffect(() => {
    if(buyWithGem) {
      setClamPrice(0);
    } else {
      setClamPriceBnb(0);
    }
    if(gradesData[selectedGrade] !== undefined) {
      setSelectedGradeData(gradesData[selectedGrade]);
      setClamUsdPrice(gradesData[selectedGrade].price);
      const updateData = async() => {
        const _clamPrice = await getUpdatedPrice(selectedGrade);
        setClamPrice(_clamPrice);
        console.log("clamPrice: " + _clamPrice);
        const _clamPriceBnb = await getClamPriceBnb(_clamPrice);
        console.log("clamPriceBNB: " + _clamPriceBnb);
        setClamPriceBnb(_clamPriceBnb);
        const _pearlPrice = await getUpdatedPearlPrice(selectedGrade);
        setPearlPrice(_pearlPrice);
        console.log("pearlPrice: " + _pearlPrice / 1e18);
      }
      updateData();

    };
  }, [selectedGrade]);

  useEffect(() => {
    if (buyWithGem) {
      const balanceBN = new BigNumber(parseEther(gemBalance).toString());
      const lockedBN = new BigNumber(lockedGem * 1e18);
      const clamPriceBN = new BigNumber(clamPrice);
      const usableLockedBN = lockedBN.isGreaterThanOrEqualTo(clamPriceBN.div(2)) ? clamPriceBN.div(2) : lockedBN;
      const totalBN = balanceBN.plus(usableLockedBN);
      if(clamPrice == 0) {
        setCanBuy(false);
      } else {
        setCanBuy(totalBN.isGreaterThanOrEqualTo(clamPriceBN));
      }

    } else {
      const balanceBN = new BigNumber(parseEther(bnbBalance).toString());
      if(clamPriceBnb == 0) {
        setCanBuy(false);
      } else {
        setCanBuy(balanceBN.isGreaterThanOrEqualTo(new BigNumber(clamPriceBnb)));
      }
    }

    //already has rng
    if (!!clamToCollect && clamToCollect != zeroHash) {
      setModalToShow("collect");
    }
  }, [gemBalance, clamPrice, clamPriceBnb, lockedGem, clamToCollect, buyWithGem]);

  const onSubmit = async () => {
    if (new BigNumber(lockedGem).gt(0) && buyWithGem) {
      buyClamWithVested(
        { address, updateCharacter, gem: formatNumber(+lockedGem, 3) },
        async () => await executeBuy(true),
        async () => await executeBuy()
      );
    } else {
      await executeBuy();
    }
  };

  const executeBuy = async (withVested) => {
    setIsLoading(true);

    buyClamProcessing({ updateCharacter }); // character speaks

    try {
      if (buyWithGem) {
        await infiniteApproveSpending(address, clamShopAddress, clamPrice);
        withVested ? await buyClamWithVestedTokens(address, selectedGrade) : await buyClam(address, selectedGrade);
      } else {
        await buyClamWithBnb(address, selectedGrade);
      }

      buyClamSuccess({ updateCharacter }); // character speaks

      ReactGA.event({
        action: ACTIONS.boughtClam,
        category: CATEGORIES.shop,
        value: parseFloat(selectedGradeData.price),
      });
      setIsLoading(false);
      setModalToShow("collect");
    } catch (e) {
      console.log("error", e.message);
      setIsLoading(false);
      updateAccount({ error: e.message });
      buyClamError({ updateCharacter }); // character speaks
    }
  };

  return (
    <>
      <ReactTooltip html={true} className="max-w-xl" />
      <Card maxHeight="100%">
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-4 relative">
          <div className="flex flex-row justify-center items-center gap-6 mb-6">
            <h2 className="text-blue-700 text-center font-semibold text-3xl mb-1">Buy Clam</h2>
            <div className="right-8 absolute" onClick={() => setBuyWithGem(!buyWithGem)}>
              <label className="label cursor-pointer p-0">
                <span className="label-text text-xl text-gray-700">Use {buyWithGem ? "GEM" : "BNB"}</span>
                <div
                  className={clsx(
                    "w-20 h-11 ml-4 rounded-full bg-white shadow-card hover:shadow-cardHover transition-all flex items-center px-1",
                    !buyWithGem && "justify-end"
                  )}
                >
                  {buyWithGem ? (
                    <div
                      className="rounded-full w-9 h-9 bg-contain"
                      style={{ backgroundImage: `url(${ClamIcon})` }}
                    />
                  ) : (
                    <div
                      className="rounded-full w-9 h-9 bg-contain"
                      style={{ backgroundImage: `url(${BnbIcon})` }}
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-row gap-4 items-center justify-between">
            <div>
              Select Grade:
            </div>
            <div className="tabs tabs-boxed">
              {gradesList.map((item, key) => {
                return <button type="button" key={key} onClick={() => {setSelectedGrade(item); setPearlPrice("...")}} className={selectedGrade != item ? "tab uppercase" : "tab uppercase tab-active"}>{item}</button>
              })}
            </div>
          </div>

          <div className="flex flex-row justify-between items-center pt-4">
            <video autoPlay playsInline loop className="w-1/3">
            <source src="https://clam-island-public.s3.us-east-2.amazonaws.com/clam-preview.mp4" type="video/mp4" />
            </video>
            <div className="w-full ml-4 grid gap-1">
              <div className="w-full flex flex-row justify-between">
                <span>Size</span>
                <div>
                  <span>{selectedGradeData.minSize} to {selectedGradeData.maxSize}</span>
                  <span className="text-xs text-gray-400"> / 100</span>
                </div>
              </div>
              <div className="w-full flex flex-row justify-between">
                <span>Lifespan</span>
                <div>
                  <span>{selectedGradeData.minLifespan} to {selectedGradeData.maxLifespan}</span>
                  <span className="text-xs text-gray-400"> / 15 Pearls</span>
                </div>
              </div>
              <div className="w-full flex flex-row justify-between">
                <span>Pearl Production Price</span>
                <div>
                  <span>{pearlPrice == "..." ? "..." : formatNumberToLocale(pearlPrice, 2, true) + " GEM"}</span>
                  <span className="text-xs text-gray-400"> ≈ ${selectedGradeData.pearlPrice}</span>
                </div>
              </div>
              <div className="w-full flex flex-row justify-between">
                <span>
                  Yield maturity&nbsp;
                  <button data-tip="Assuming all Pearls produced are claimed for max GEM yield as early as possible. Max GEM yield may be claimed if a Pearl matches the Pearl traits in the Bank (rotated every 12 hours) and the 30-day yield stream option is selected.">
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </button>
                </span>
                <span>{selectedGradeData.minLifespan * minPearlProductionTime + 30} to {selectedGradeData.maxLifespan * maxPearlProductionTime + 36 + 30} days</span>
              </div>
              <div className="w-full flex flex-row justify-between">
                <span>&nbsp;</span>
                <span className="text-gray-400 text-xs">Average {(parseFloat(selectedGradeData.minLifespan) + parseFloat(selectedGradeData.maxLifespan)) / 2 * (minPearlProductionTime + maxPearlProductionTime) / 2 + 18 + 30} days</span>
              </div>
              <div className="w-full flex flex-row justify-between">
                <span>
                  Net GEM ROI&nbsp;
                  <button type="button" data-tip="Assuming max GEM yield is claimed for all Pearls produced">
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </button>
                </span>
                <span>-45% to {formatNumberToLocale(32000)}%</span>
              </div>
              <div className="w-full flex flex-row justify-between">
                <span>&nbsp;</span>
                <span className="text-gray-400 text-xs">Average 66%</span>
              </div>
            </div>
          </div>

          {/* input */}
          <div className="bg-white shadow-card rounded-xl p-4 my-6">
            <div className="px-2 py-2">
              <div className="flex flex-col">
                <div className="flex justify-between items-center my-2">
                  <div className="text-lg font-semibold">Price of Grade {selectedGrade.toUpperCase()} Clam</div>
                  <div onClick={() => setBuyWithGem(!buyWithGem)}>
                    <label className="label cursor-pointer p-0">
                      <span className="label-text">Buy with {buyWithGem ? "GEM" : "BNB"}</span>
                      <div
                        className={clsx(
                          "w-14 h-8 ml-2 rounded-2xl bg-gray-200 flex items-center px-1",
                          !buyWithGem && "justify-end"
                        )}
                      >
                        {buyWithGem ? (
                          <div
                            className="rounded-full w-6 h-6 bg-contain"
                            style={{ backgroundImage: `url(${ClamIcon})` }}
                          />
                        ) : (
                          <div
                            className="rounded-full w-6 h-6 bg-contain"
                            style={{ backgroundImage: `url(${BnbIcon})` }}
                          />
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col text-sm text-gray-600">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex items-center text-xl">
                        <img className="w-12 h-12 mr-2" src={buyWithGem ? ClamIcon : BnbIcon} />
                        <div className="flex flex-col text-right text-black p-2 font-extrabold">
                          <span>
                            {buyWithGem
                              ? clamPrice == 0
                                ? "... GEM"
                                : `${renderNumber(+formatEther(clamPrice), 2)} GEM`
                              : clamPriceBnb == 0
                              ? "... BNB"
                              : `${renderNumber(+formatEther(clamPriceBnb), 2)} BNB`}
                            {!buyWithGem && (
                              <button type="button" data-tip="80% of BNB price is used to purchase GEM, the other 20% is sent to treasury. BNB price may be more than USD equivalent price displayed below due to slippage on conversion to GEM.">
                                <FontAwesomeIcon className="ml-1" icon={faInfoCircle} />
                              </button>
                            )}
                          </span>
                          <span className="text-sm">{renderNumber(+clamUsdPrice, 2)} USD</span>
                        </div>
                      </div>
                      <div className="flex flex-col my-2 pl-4 w-1/2">
                        <div className="flex justify-between">
                          <span>Wallet:</span>
                          <span>
                            {buyWithGem
                              ? `${formatNumber(+gemBalance, 3)} GEM`
                              : `${formatNumber(+bnbBalance, 3)} BNB`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vested:</span>
                          <span>{formatNumber(+lockedGem, 3)} GEM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-md my-2 text-xs text-gray-400">
                  {mintedThisWeek} Clams purchased this week
                </div>
              </div>
            </div>
          </div>

          {/* output */}


          <div className="py-2 flex flex-col">
            {disableButton ? (
              <button
                disabled
                type="submit"
                className="disabled cursor-not-allowed block uppercase text-center shadow bg-red-300  focus:shadow-outline focus:outline-none text-white text-xl py-3 px-10 rounded-xl"
              >
                Already purchased
              </button>
            ) : (
              <>
                {isLoading ? (
                  <button
                    disabled={isLoading}
                    style={{ textAlign: "center" }}
                    type="submit"
                    className="flex justify-center items-center block uppercase text-center shadow bg-yellow-200 text-yellow-600 text-xl py-3 px-10 rounded-xl cursor-not-allowed"
                  >
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-yello-600"
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
                    </svg>{" "}
                    <span>Sending transaction...</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`block uppercase text-center shadow hover:bg-blue-700 focus:shadow-outline focus:outline-none text-white text-xl py-3 px-10 rounded-xl
                        ${canBuy ? "bg-blue-600" : "btn-disabled bg-grey-light"}
                        `}
                  >
                    {canBuy ? "Buy Clam" : "Not enough balance"}
                  </button>
                )}
              </>
            )}
          </div>
        </form>
      </Card>
    </>
  );
};

const mapToProps = (store) => store;
export default connect(mapToProps, actions)(ClamBuyModal);
