import React, {useState, useEffect} from "react";
import { connect } from "redux-zero/react";
import { actions } from "store/redux";
import { formatEther, parseEther } from "@ethersproject/units";
import Web3 from 'web3';

import { balanceOf, allowance, getTokenInfo, approve } from "web3/bep20";
import {
    gemTokenAddress,
    shellTokenAddress,
    wBNB,
    BUSD,
    pancakeRouterAddress,
    tokens,
    serializeTokens
} from "constants/constants";
import { 
    getQuote, 
    swap, 
    getTokenAmountFromOtherToken, 
    getUsdPriceOfToken, 
    getTrade, 
    getGasEstimation, 
    calculateGasMargin,
    getPriceImpactWithoutFee
} from "web3/pancakeRouter";

import { 
    onSwapTxn, 
    onSwapSuccess, 
    onSwapError, 
    onApproveTxn, 
    onApproveSuccess, 
    onApproveError 
} from './../../views/bank/character/Exchange';
import SwapSetting from "./SwapSetting";

let logoURI = "";

const Exchange = ({account: { address, isBSChain, isWeb3Installed, isConnected }, updateCharacter, updateAccount}) => {

    const [isTokenSelectShowing, toggleTokenSelectModal] = useState(false);
    const [selectToken, setSelectToken] = useState("input");
    const [iAmount, setIAmount] = useState(0);
    const [oAmount, setOAmount] = useState(0);
    const [iTokenBalance, setITokenBalance] = useState(0);
    const [oTokenBalance, setOTokenBalance] = useState(0);
    const [allowanceAmount, setAllowanceAmount] = useState(0);
    const [tokenSearch, setTokenSearch] = useState("");
    const [searchedToken, setSearchedToken] = useState({});
    const [slippage, setSlipage] = useState(0.5);
    const [deadline, setDeadline] = useState(20);
    const [isLoading, setLoading] = useState(false);
    const [priceImpact, setPriceImpact] = useState();



    if(process.env.NODE_ENV === "development") {
        logoURI = "https://pancake.kiemtienonline360.com/images/coins/";
    } else {
        logoURI = "https://pancakeswap.finance/images/tokens/";
    }
    
    useEffect(() => {
        
        console.log("exchange-tab tokens", tokens.wbnb);
        console.log("exchange-tab logoURI", logoURI);
    }, [])

    const [iToken, setIToken] = useState(serializeTokens[0]);

    const [oToken, setOToken] = useState(serializeTokens[1]);

    useEffect(async () => {
        if(iToken && address) {
            const _balance = await getTokenBalance(iToken.address);
            setITokenBalance(_balance);

            const _allowalnceAmount = await getAllowanceAmount(iToken.address);
            setAllowanceAmount(_allowalnceAmount);
        }
    }, [iToken, address])

    useEffect(async () => {
        if(oToken && address) {
            const _balance = await getTokenBalance(oToken.address);
            setOTokenBalance(_balance);
        }
    }, [oToken, address])

    useEffect(async () => {
        if( iAmount && iToken && oToken ) {
            // Set oAmount from iAmount
            const _oAmount = await getTokenAmountFromOtherToken(iAmount, iToken.address, oToken.address);
            setOAmount(_oAmount);

            // Get Price Impact
            const { priceImpactWithoutFee } = await getPriceImpactWithoutFee(iToken, oToken, iAmount, _oAmount);
            if(priceImpactWithoutFee) {
                console.log('priceImpactWithoutFee',  priceImpactWithoutFee.toFixed(2));
            }
            else {
                console.log('priceImpactWithoutFee______');
            }
            setPriceImpact( priceImpactWithoutFee );
        }
        else {
            setOAmount(0)
        }
    }, [iAmount, iToken, oToken])

    useEffect(() => {
        // Get Out Amount in every 3 seconds.
        setInterval(async () => {
            if( iAmount && iToken && oToken ) {
                const _oAmount = await getTokenAmountFromOtherToken(iAmount, iToken.address, oToken.address);
                setOAmount(_oAmount);
            }
        }, 3000)
    }, [])


    // Token Select Modal
    useEffect(async () => {
        const _isAddress = web3.utils.isAddress(tokenSearch);
        if(_isAddress) {
            try {
                const _tokeninfo = await getTokenInfo(tokenSearch);
                for (let i = 0; i < tokens.length; i++) {
                    if(tokens[i].address == _tokeninfo.address) return;
                }
                for (let i = 0; i < serializeTokens.length; i++) {
                    if(serializeTokens[i].address == _tokeninfo.address) return;
                }
                _tokeninfo.logoURI = "/assets/custom_token.png";
                setSearchedToken(_tokeninfo);
            } catch (error) {
                setSearchedToken({});
                console.log("check token error", error);
            }
        }
    }, [tokenSearch])
  
    const setTokenData = async (row) => {
        if(selectToken == "input") {
            if(row.address == oToken.address) {
                setOToken(iToken);
            }
            setIToken(row);
        }
        else {
            if(row.address == iToken.address) {
                setIToken(oToken);
            }
            setOToken(row);
        }

        toggleTokenSelectModal(false);
    }

    const getTokenBalance = async (_tokenAddr) => {
        if( _tokenAddr == wBNB ) {
            const _balance = await web3.eth.getBalance(address);
            console.log("bnb value", _balance);
            return _balance;
        }
        const _balance = await balanceOf(_tokenAddr, address);
        return _balance;
    }

    const getAllowanceAmount = async (_tokenAddr) => {
        const _amount = await allowance(iToken.address, address, pancakeRouterAddress);
        return _amount;
    }

    const getTradeData = async () => {

        const _result = await getTrade(iToken, oToken, iAmount, oAmount, slippage, deadline);
        console.log('Trade Data', _result);
    }

    const setMax = async () => {
        // Get Estimation Gas Fee
        if(iToken.address == wBNB) {
            const estimateGas = await getGasEstimation(iToken, oToken, "1", "1", slippage, deadline);
            setIAmount( formatEther((iTokenBalance - estimateGas * 2 * 10 ** 10).toString()) );
        }
        else {
            setIAmount( formatEther(iTokenBalance) );
        }
    }

    const exchange = async () => {
        // setLoading(true);
        // onSwapTxn(updateCharacter);
        // try {
            await swap(iToken, oToken, iAmount, oAmount, slippage, deadline);
        //     onSwapSuccess(updateCharacter);

        //     setIAmount(0);
        //     setOAmount(0);

        //     setITokenBalance(await getTokenBalance(iToken.address));
        //     setOTokenBalance(await getTokenBalance(oToken.address));
        // } catch (error) {
        //     updateAccount({ error: error.message });
        //     onSwapError(updateCharacter);
        // }

        setLoading(false);
    }

    const approve_token = async () => {
        setLoading(true);

        onApproveTxn(updateCharacter);
        try {
            await approve(iToken.address, pancakeRouterAddress, iTokenBalance);
            onApproveSuccess(updateCharacter);

            // Get Allowance Amount
            const _allowalnceAmount = await getAllowanceAmount(iToken.address);
            setAllowanceAmount(_allowalnceAmount);
            
        } catch (error) {
            updateAccount({ error: error.message });
            onApproveError(updateCharacter);
        }

        setLoading(false);
    }


    return (
        // <div className="w-full h-full flex flex-col items-center p-5">
        //   <div className="mx-2 text-3xl font-aristotelica-bold text-center mt-24">
        //     Integrated Exchange
        //     <br />
        //     Coming Soon!
        //   </div>
        //   <div className="flex flex-col items-center mt-24">
        //     <a
        //       className="btn btn-secondary drop-shadow-button w-[200px]"
        //       href="https://app.bogged.finance/swap?tokenIn=BNB&tokenOut=0x9fb4DEF63f8caEC83Cb3EBcC22Ba0795258C988a"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Exchange $GEM&nbsp;
        //       <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1" />
        //     </a>
        //     <a
        //       className="btn btn-secondary drop-shadow-button mt-4 w-[200px]"
        //       href="https://app.bogged.finance/swap?tokenIn=BNB&tokenOut=0x01c16da6E041Cf203959624Ade1F39652973D0EB"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Exchange $SHELL&nbsp;
        //       <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1" />
        //     </a>
        //   </div>
        // </div>
        
        <>
            <div>

                <div className="flex justify-end mb-2 mx-2">
                    <SwapSetting 
                        slippage={slippage} 
                        setSlipage={setSlipage}
                        deadline={deadline}
                        setDeadline={setDeadline}
                    />
                </div>

                <div className='text-sm'>
                    <div className='bg-gray-100 rounded-lg p-4'>
                        <div className='flex justify-between'>
                            <input 
                                type='number' 
                                className='h-8 bg-transparent px-3 outline-0 w-full' 
                                style={{outline: "none"}} 
                                value={iAmount}
                                onChange={(e) => {
                                    setIAmount(e.target.value)
                                } }
                            />
                            <button 
                                className='flex justify-end items-center rounded-2xl gap-2 tokenSelect p-2 h-8'
                                onClick={() => { setSelectToken("input"); setTokenSearch(""); toggleTokenSelectModal(true); }}
                            >
                                <img className="h-6" alt={iToken.symbol} src={iToken.logoURI} /> 
                                <p className='text-md'>{iToken.symbol}</p>
                                <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                            </button>
                        </div>
                        <div className='flex justify-end mt-3'>
                            <div className='flex gap-3 items-center'>
                                <p>Balance { iTokenBalance > 0 ? Math.floor(parseFloat(formatEther(iTokenBalance)) * 100) / 100 : 0 }</p> 
                                <p className='rounded-2xl text-xs px-1 maxtext cursor-pointer' onClick={() => setMax() }>MAX</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='text-center' style={{marginTop: "-10px", marginBottom: "-10px"}}>
                    <button className='border-2 border-white rounded-2xl bg-gray-100 text-lg px-2 cursor-pointer' 
                        style={{borderColor: "white"}}
                        onClick={() => {
                            const temp = iToken;
                            setIToken(oToken);
                            setOToken(temp);

                            const tempAmount = oAmount;
                            setOAmount(iAmount);
                            setIAmount(tempAmount);
                        }}
                    >
                        &#x2193;
                    </button>
                </div>

                <div className='text-sm'>
                    <div className='bg-gray-100 rounded-lg p-4'>
                        <div className='flex justify-between'>
                            <input 
                                type='number' 
                                className='h-8 bg-transparent px-3 outline-0 w-full' 
                                style={{outline: "none"}} 
                                value={ oAmount > 0 ? parseFloat(oAmount).toFixed(5) : 0 }
                                onChange={(e) => setOAmount(e.target.value)}
                                disabled={'true'}
                            />
                            <button 
                                className='flex justify-end items-center rounded-2xl gap-2 tokenSelect p-2 h-8' 
                                onClick={() => { setSelectToken("output"); setTokenSearch(""); toggleTokenSelectModal(true); }}
                            >
                                <img className="h-6" alt={oToken.symbol} src={oToken.logoURI} /> 
                                <p className='text-md'>{oToken.symbol}</p>
                                <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg" className="sc-5a69fd5e-0 fIBjTm"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                            </button>
                        </div>
                        <div className='flex justify-end mt-3'>
                            <div className='flex gap-3 items-center'>
                                <p>Balance { oTokenBalance > 0 ? parseFloat(formatEther(oTokenBalance)).toFixed(2) : 0 }</p> 
                            </div>
                        </div>
                    </div>
                </div>

                <dic className="text-sm mt-2 text-right">
                    <p>Price Impact: { priceImpact ? priceImpact.toFixed(2) : "0" }%</p>
                    {/* <p>Minimum received: 12000 GEM</p> */}
                </dic>

                {
                    iToken.address == wBNB || allowanceAmount > 0 ? (
                        <>
                            <button 
                                className='btn btn-primary w-full mt-2' 
                                onClick={exchange}
                                disabled={
                                    isLoading || !address || iAmount <=0 
                                    // || !priceImpact || priceImpact.toFixed(2) > 15  
                                }
                            >
                                {
                                    // priceImpact && priceImpact.toFixed(2) ? "Price Impact Too High" : 
                                    isLoading ? "Loadding..." : "Exchange"    
                                }
                            </button>   
                        </>
                    ) : (
                        <>
                            <button 
                                className='btn btn-primary w-full mt-2' 
                                onClick={approve_token}
                                disabled={isLoading || !address }
                            >
                                {
                                    isLoading ? "Loading..." : "Approve"
                                }
                            </button>
                        </>
                    )
                }

            </div>

            {/* // Token Select Modal */}
            <div id="myModal" className={`n-modal ${ isTokenSelectShowing ? "block" : "none" }`}>
                <div className="n-modal-content">
                    <div className='flex justify-between mt-2 items-center'>
                        <p>Select a token</p>
                        <span className="text-2xl font-black" onClick={() => toggleTokenSelectModal(false)}>&times;</span>
                    </div>
                    <div className='mt-4'>
                        <input 
                            type='text' 
                            className='w-full h-12 rounded-xl outline-0 text-sm border p-3 border-black' 
                            placeholder='Search name or paste address'
                            style={{outline: "none"}} 
                            value={tokenSearch}
                            onChange={(e) => setTokenSearch(e.target.value)}
                        />
                    </div>
                    <div className='mt-4 overflow-auto' style={{maxHeight: "300px"}}>
                        
                        { serializeTokens && serializeTokens.map((row, i) => {
                            if(tokenSearch) {
                                if( row.address.toLowerCase() == tokenSearch.toLowerCase() || row.symbol.toLowerCase().indexOf(tokenSearch.toLowerCase()) >= 0 ) { }
                                else return ;
                            }

                            return (
                                <div className='mt-4 flex gap-2 items-center' key={i} onClick={() => setTokenData(row)}>
                                    <img className="h-8" alt={row.symbol} src={row.logoURI} /> 
                                    <div>
                                        <p className='text-md'>{row.symbol}</p>
                                    </div>
                                </div>
                            )
                        })}
                        
                        { tokens && tokens.map((row, i) => {
                            if(i>3) return ;
                            if(tokenSearch) {
                                if( row.address.toLowerCase() == tokenSearch.toLowerCase() || row.symbol.toLowerCase().indexOf(tokenSearch.toLowerCase()) >= 0 ) { }
                                else return ;
                            }
                            row.logoURI = logoURI + row.address.toLowerCase() + ".png";
                            return (
                                <div className='mt-4 flex gap-2 items-center' key={i} onClick={() => setTokenData(row)}>
                                    <img className="h-8" alt={row.symbol} src={row.logoURI} /> 
                                    <div>
                                        <p className='text-md'>{row.symbol}</p>
                                    </div>
                                </div>
                            )
                        })}

                        { searchedToken && (
                            <div className='mt-4 flex gap-2 items-center' onClick={() => setTokenData(searchedToken)}>
                                <img className="h-8" alt={searchedToken.symbol} src={searchedToken.logoURI} /> 
                                <div>
                                    <p className='text-md'>{searchedToken.symbol}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
};

const mapToProps = (state) => state;
export default connect(mapToProps, actions)(Exchange);
