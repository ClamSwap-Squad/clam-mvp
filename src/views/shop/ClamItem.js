import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { formatUnits } from "@ethersproject/units";

import {
  getClamValueInShellToken,
} from "../../web3/clam";

import "./index.scss";
import { formatNumberToLocale } from "utils/formatNumberToLocale";


const formatShell = (value) => (value ? formatUnits(String(value), 18) : "0");

const ClamItem = ({ clam, pearlValueInShellToken, harvestClam }) => {
    const { tokenId, img } = clam;
    const { pearlProductionCapacity, pearlsProduced } = clam.clamDataValues;
    const [clamValueInShellToken, setClamValueInShellToken] = useState("0");
  
    useEffect(() => {
  
      const fetchData = async () => {
        if(clam.clamDataValues.grade) {
          setClamValueInShellToken(await getClamValueInShellToken(clam.clamDataValues.grade));
        } else {
          setClamValueInShellToken(await getClamValueInShellToken());
        }
  
      }
      fetchData();
    })
  
    const harvestableShell =
      +clamValueInShellToken > 0
        ? +clamValueInShellToken + +pearlsProduced * +pearlValueInShellToken
        : "0";
  
    return (
      <>
        <div className="div_lg">
          <div>
            <div className="card bg-white shadow-lg overflow-visible w-full border-4 border-gray-50 hover:border-4 hover:border-blue-200 ">
              <div className="flex-shrink-0">
                <img className="h-64 w-full object-fill" src={img} alt="" />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex justify-between px-4 py-2">
                    <div className=" badge badge-success">#{tokenId}</div>
                    <div className="text-green-400 text-bold">{clam.dnaDecoded.rarity}</div>
                  </div>
  
                  <div className="block mt-2">
                    <div className="border rounded border-gray-200">
                      <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:gap-4 sm:px-6">
                          <div className="flex flex-row w-full justify-between">
                            <dt className="text-sm font-medium text-gray-500">$SHELL</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                              {harvestableShell > 0 ? formatShell(harvestableShell) : "..."}
                            </dd>
                          </div>
                        </div>
                        <div className="bg-gray-100 px-4 py-5 sm:grid sm:gap-4 sm:px-6">
                          <div className="flex flex-row w-full justify-between">
                            <dt className="text-sm font-medium text-gray-500">Lifespan</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                              {+pearlProductionCapacity - +pearlsProduced} / {+pearlProductionCapacity}{" "}
                              pearls
                            </dd>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:gap-4 sm:px-6">
                          <div className="flex flex-row w-full justify-between">
                            <dt className="text-sm font-medium text-gray-500">Clam Boost</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                              {formatNumberToLocale(clam.pearlBoost, 2) + "x"}
                            </dd>
                          </div>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="flex items-center flex-col">
                  <Link
                    to={`/saferoom/clam?id=${tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-neutral mt-4 font-montserrat font-bold w-full"
                  >
                    View in saferoom&nbsp;
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </Link>
                  <div className="w-full">
                    <button
                      className="btn btn-secondary mt-4 font-montserrat font-bold w-full"
                      onClick={() =>
                        harvestClam(tokenId, formatNumberToLocale(harvestableShell, 1, true))
                      }
                    >
                      Harvest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="div_sm">
          <div>
            <div className="card bg-white shadow-lg overflow-visible w-full border-4 border-gray-50 hover:border-4 hover:border-blue-200 ">
              <div className="flex-shrink-0 px-3">
                <img className="h-32 w-full object-fill" src={img} alt="" />
              </div>
              <div className="flex-1 bg-white p-2 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className=" badge badge-success">#{tokenId}</div>
                    <div className="text-green-400 text-bold">{clam.dnaDecoded.rarity}</div>
                  </div>
  
                  <div className="block mt-2">
                    <div className="border rounded border-gray-200">
                      <dl>
                        <div className="bg-gray-50 px-1 py-2 sm:grid sm:gap-4 sm:px-6">
                          <div className="flex flex-row w-full justify-between items-center">
                            <dt className="text-xs font-medium text-gray-500">$SHELL</dt>
                            <dd className="mt-1 text-xs text-gray-900 sm:mt-0 text-right">
                              {harvestableShell > 0 ? formatShell(harvestableShell) : "..."}
                            </dd>
                          </div>
                        </div>
                        <div className="bg-gray-100 px-1 py-2 sm:grid sm:gap-4 sm:px-6">
                          <div className="flex flex-row w-full justify-between items-center">
                            <dt className="text-xs font-medium text-gray-500">Lifespan</dt>
                            <dd className="mt-1 text-xs text-gray-900 sm:mt-0 text-right">
                              {+pearlProductionCapacity - +pearlsProduced} / {+pearlProductionCapacity}{" "}
                              pearls
                            </dd>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-1 py-2 sm:grid sm:gap-4 sm:px-6">
                          <div className="flex flex-row w-full justify-between items-center">
                            <dt className="text-xs font-medium text-gray-500">Clam Boost</dt>
                            <dd className="mt-1 text-xs text-gray-900 sm:mt-0 text-right">
                              {formatNumberToLocale(clam.pearlBoost, 2) + "x"}
                            </dd>
                          </div>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="flex items-center flex-col">
                  <Link
                    to={`/saferoom/clam?id=${tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-neutral mt-4 font-montserrat font-bold w-full"
                  >
                    View in saferoom&nbsp;
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </Link>
                  <div className="w-full">
                    <button
                      className="btn btn-secondary mt-4 font-montserrat font-bold w-full"
                      onClick={() =>
                        harvestClam(tokenId, formatNumberToLocale(harvestableShell, 1, true))
                      }
                    >
                      Harvest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  export default ClamItem;