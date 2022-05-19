import { useState, useMemo } from "react";
import { useAsync, useLocalStorage } from "react-use";
import { connect } from "redux-zero/react";
import moment from "moment";
import { actions } from "store/redux";
import { formatMsToDuration } from "utils/time";
import { color, shape, periodStart, periodInSeconds, periodCheckpoint, getCurrentShapeAndColour } from "web3/pearlBurner";
import { getGemPrice } from "web3/gemOracle";
import { useTimer } from "hooks/useTimer";
import { getPearlsMaxBoostTime } from "utils/getPearlsMaxBoostTime";
import PearlInfo from "./PearlInfo";
import { SORT_ORDER_PEARLS_KEY } from "constants/sorting";
import { getSortedPearls } from "utils/pearlsSort";
import { PearlsSorting } from "components/pearlsSorting";

import "../bank.scss";

const BurnPearlModal = (props) => {
  const {
    account: { pearls: unsortedPearls },
    updateAccount,
    isNativeStaker,
    sorting: {
      bank: { pearls: pearlsSortOrder },
    },
  } = props;
  const [pearls, setPearls] = useState([]);
  const [boostedShape, setBoostedShape] = useState("");
  const [boostedColor, setBoostedColor] = useState("");
  const [startOfWeek, setStartOfWeek] = useState("");
  const [periodInSecs, setPeriodInSecs] = useState("");
  const [gemPriceUSD, setGemPriceUSD] = useState(1);
  const [sortOrderPearls = {}] = useLocalStorage(SORT_ORDER_PEARLS_KEY);

  const updateShapeAndColour = async () => {
    setBoostedShape("Loading...");
    setBoostedColor("Loading...");
    const currentShapeAndColour = await getCurrentShapeAndColour();
    const _shape = currentShapeAndColour[0];
    const _color = currentShapeAndColour[1];
    setBoostedShape(_shape);
    setBoostedColor(_color);
  }

  const calculateTimeLeft = () => {
    if (startOfWeek === "") return "calculating...";

    const startOfWeekMs = +startOfWeek * 1000;
    const remainingMs = periodInSecs * 1000 - moment().diff(startOfWeekMs) % (periodInSecs * 1000);
    const duration = formatMsToDuration(remainingMs);

    return duration;
  };

  const { timeLeft } = useTimer(calculateTimeLeft);

  useAsync(async () => {
    try {
      const sortedOwnedPearls = getSortedPearls(
        unsortedPearls,
        sortOrderPearls.value,
        sortOrderPearls.order
      );
      setPearls(sortedOwnedPearls);

      const currentShapeAndColour = await getCurrentShapeAndColour();

      const _shape = currentShapeAndColour[0];
      const _color = currentShapeAndColour[1];
      setBoostedShape(_shape);
      setBoostedColor(_color);

      const start = await periodStart();
      setStartOfWeek(start);

      const periodInSecs = await periodInSeconds();
      setPeriodInSecs(periodInSecs);

      const startOfWeekMs = +start * 1000;
      const remainingMs = periodInSecs * 1000 - moment().diff(startOfWeekMs) % (periodInSecs * 1000);

      setTimeout(() => {
        updateShapeAndColour();
        setInterval(() => {
          updateShapeAndColour();
        }, periodInSecs * 1000);
      }, remainingMs+5000);

      const gemPrice = await getGemPrice();
      setGemPriceUSD(gemPrice);
    } catch (err) {
      console.error(err);
      updateAccount({ error: err.message });
    }
  });

  const boostedPearls = useMemo(
    () =>
      pearls.filter(
        ({ dnaDecoded }) => dnaDecoded.shape === boostedShape && dnaDecoded.color === boostedColor
      ),
    [pearls, boostedShape, boostedColor]
  );
  const regularPearls = useMemo(
    () =>
      pearls.filter(
        ({ dnaDecoded }) => dnaDecoded.shape !== boostedShape || dnaDecoded.color !== boostedColor
      ),
    [pearls, boostedShape, boostedColor]
  );

  const renderPearl = (pearl, i, a) => (
    <PearlInfo
      key={pearl.pearlId}
      pearl={pearl}
      isLast={i === a.length - 1}
      isNativeStaker={isNativeStaker}
      showBurn
      maxBoostIn={getPearlsMaxBoostTime({
        shape: pearl.dnaDecoded.shape,
        colour: pearl.dnaDecoded.color,
        currentBoostColour: boostedColor,
        currentBoostShape: boostedShape,
        period: periodInSecs,
        startOfWeek,
      })}
      gemPriceUSD={gemPriceUSD}
    />
  );

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row justify-center gap-4 item-center">
        <h1 className="text-3xl font-aristotelica-bold black text-center pt-2">Choose a pearl</h1>
        <div className="max-w-325">
          <PearlsSorting page="bank" textSize="md" />
        </div>
      </div>
      <div className="w-full p-4 flex justify-between">
        <div className="flex flex-col w-3/5">
          <span className="font-aristotelica-bold text-xl">Traits for Max GEM Yield</span>
            <span className="text-gray-500">Changes in: {timeLeft}</span>
        </div>
        <div className="flex flex-col w-2/5 items-end">
          <div>
            <span className="inline-block mr-2">Shape:</span>
            <span>{boostedShape}</span>
          </div>
          <div>
            <span className="inline-block mr-2">Color:</span>
            <span>{boostedColor}</span>
          </div>
        </div>
      </div>
      <div style={{ height: window.innerHeight * 0.5 }} className="overflow-y-auto">
        <div className="w-full flex flex-col p-4">
          <div
            className={`w-full mr-8 rounded-lg p-4 flex flex-col shadow-card mb-6 ${
              !boostedPearls.length ? "hidden" : ""
            }`}
          >
            <div className="w-full">
              {boostedPearls.length ? (
                getSortedPearls(boostedPearls, pearlsSortOrder.value, pearlsSortOrder.order).map(
                  renderPearl
                )
              ) : (
                <p>No pearls available for Max GEM Yield</p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col max-h-160">
            <div>
              {!!regularPearls.length && (
                <p className="font-bold mb-4">Not available for Max GEM Yield:</p>
              )}
              {regularPearls.length ? (
                getSortedPearls(regularPearls, pearlsSortOrder.value, pearlsSortOrder.order).map(
                  renderPearl
                )
              ) : (
                <p>No pearls available for GEM Yield</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToProps = (state) => state;
export default connect(mapToProps, actions)(BurnPearlModal);
