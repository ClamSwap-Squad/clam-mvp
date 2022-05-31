import React, { Fragment, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Web3 from 'web3';
import minABI from './minABI.json';

import { balanceOf } from "web3/bep20";
import {
    gemTokenAddress,
    shellTokenAddress,
    wBNB,
    BUSD
} from "constants/constants";


const Exchange = ({address}) => {

    const [tab, setTab] = useState('exchange');
    const [isTokenSelectShowing, toggleTokenSelectModal] = useState(false);
    const [selectToken, setSelectToken] = useState("input");

    let logoURI = "";
    useEffect(() => {
        if(process.env.NODE_ENV === "development") {
            logoURI = "https://pancake.kiemtienonline360.com/images/coins/";
        } else {
            logoURI = "https://pancakeswap.finance/images/tokens/";
        }
    })

    const [iToken, setIToken] = useState({
        address: wBNB,
        decimals: 18,
        logoURI: `https://pancake.kiemtienonline360.com/images/coins/0xae13d989dac2f0debff460ac112a837c89baa7cd.png`,
        name: "BNB",
        symbol: "BNB",
    });

    const [oToken, setOToken] = useState({
        address: gemTokenAddress,
        decimals: 18,
        logoURI: `${process.env.PUBLIC_URL}/favicon/android-chrome-192x192.png`,
        name: "GEM",
        symbol: "GEM",
    });

    const tokenlist = [
        {
            address: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
            decimals: 18,
            logoURI: "https://pancake.kiemtienonline360.com/images/coins/0xae13d989dac2f0debff460ac112a837c89baa7cd.png",
            name: "BNB",
            symbol: "BNB",
        },
        {
            address: gemTokenAddress,
            decimals: 18,
            logoURI: `${process.env.PUBLIC_URL}/favicon/android-chrome-192x192.png`,
            name: "GEM",
            symbol: "GEM",
        },
        {
            address: shellTokenAddress,
            decimals: 18,
            logoURI: `${process.env.PUBLIC_URL}/favicon/android-chrome-192x192.png`,
            name: "SHELL",
            symbol: "SHELL",
        },
        {
            address: BUSD,
            decimals: 18,
            logoURI: "https://pancake.kiemtienonline360.com/images/coins/0x78867bbeef44f2326bf8ddd1941a4439382ef2a7.png",
            name: "BUSD",
            symbol: "BUSD",
        },
    ];

    useEffect(() => {
        if(address) {
            getTokenBalance(iToken.address);
        }
    }, [address])
    

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
        console.log('token address', _tokenAddr);
        console.log('user address', address);

        const data = await Promise.all([
            balanceOf(_tokenAddr, address),
        ]);
        console.log('data', data);
    
        const balance = await balanceOf(_tokenAddr, address);
        console.log('balance', balance);
    }


    return (
        <>
        
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <ul className="flex justify-center flex-wrap -mb-px text-sm font-medium text-center">
                        <li onClick={() => setTab('buyBNB')}>
                            <button className={`inline-block p-4 rounded-t-lg ${ tab == "buyBNB" ? "border-b-2" : "border-b-1" }`}>Buy BNB</button>
                        </li>
                        <li onClick={() => setTab("exchange")}>
                            <button className={`inline-block p-4 rounded-t-lg ${ tab == "exchange" ? "border-b-2" : "border-b-1" }`}>Exchange</button>
                        </li>
                    </ul>
                </div>

                <div>
                    {
                        tab == "buyBNB" ? (
                            <>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Comming Soon.</p>
                            </>
                        ) : ( "" )
                    }
                    
                    {
                        tab == "exchange" ? (
                            <>
                                <div className='text-sm'>
                                    <div className='bg-gray-100 rounded-lg p-4'>
                                        <div className='flex justify-between'>
                                            <input type='text' className='h-8 bg-transparent px-3 outline-0' style={{outline: "none"}} />
                                            <button 
                                                className='flex justify-end items-center rounded-2xl gap-2 tokenSelect p-2 h-8'
                                                onClick={() => {toggleTokenSelectModal(true); setSelectToken("input"); }}
                                            >
                                                <img className="h-6" alt={iToken.symbol} src={iToken.logoURI} /> 
                                                <p className='text-md'>{iToken.symbol}</p>
                                                <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                                            </button>
                                        </div>
                                        <div className='flex justify-end mt-3'>
                                            <div className='flex gap-3 items-center'>
                                                <p>Balance 15.12</p> <p className='rounded-2xl text-xs px-1 maxtext cursor-pointer'>MAX</p>
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
                                        }}
                                    >
                                        &#x2193;
                                    </button>
                                </div>

                                <div className='text-sm'>
                                    <div className='bg-gray-100 rounded-lg p-4'>
                                        <div className='flex justify-between'>
                                            <input type='text' className='h-8 bg-transparent px-3 outline-0' style={{outline: "none"}} />
                                            <button 
                                                className='flex justify-end items-center rounded-2xl gap-2 tokenSelect p-2 h-8' 
                                                onClick={() => {toggleTokenSelectModal(true); setSelectToken("output"); }}
                                            >
                                                <img className="h-6" alt={oToken.symbol} src={oToken.logoURI} /> 
                                                <p className='text-md'>{oToken.symbol}</p>
                                                <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg" className="sc-5a69fd5e-0 fIBjTm"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                                            </button>
                                        </div>
                                        <div className='flex justify-end mt-3'>
                                            <div className='flex gap-3 items-center'>
                                                <p>Balance 15.12</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className='btn btn-primary w-full mt-2'>Exchange</button>
                            </>
                        ) : ( "" )
                    }
                </div>

            </div>

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
                        />
                    </div>
                    <div className='mt-4'>

                        { tokenlist && tokenlist.map((row, i) => (
                            <div className='mt-4 flex gap-2 items-center' key={i} onClick={() => setTokenData(row)}>
                                <img className="h-8" alt={row.symbol} src={row.logoURI} /> 
                                <div>
                                    <p className='text-md'>{row.symbol}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Exchange;