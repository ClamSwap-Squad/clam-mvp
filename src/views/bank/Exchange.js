import React, { Fragment, useState } from 'react';
import { Link } from "react-router-dom";

const Exchange = () => {
    const [tab, setTab] = useState('exchange');

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
                                            <input type='text' className='h-8 bg-transparent pr-3' />
                                            <button className='flex justify-end items-center rounded-2xl gap-2 tokenSelect p-2 h-8'>
                                                <img className="h-6" alt="BELT logo" src="https://pancakeswap.finance/images/tokens/0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f.png" /> 
                                                <p className='text-md'>BNB</p>
                                                <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg" className="sc-5a69fd5e-0 fIBjTm"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                                            </button>
                                        </div>
                                        <div className='flex justify-end mt-3'>
                                            <div className='flex gap-3 items-center'>
                                                <p>Balance 15.12</p> <p className='rounded-md text-xs bg-sky-500 text-sky-700'>MAX</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-sm'>
                                    <div className='bg-gray-100 rounded-lg p-4'>
                                        <div className='flex justify-between'>
                                            <input type='text' className='h-8 bg-transparent pr-3' />
                                            <button className='flex justify-end items-center rounded-2xl gap-2 tokenSelect p-2 h-8'>
                                                <img className="h-6" alt="BELT logo" src="https://pancakeswap.finance/images/tokens/0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f.png" /> 
                                                <p className='text-md'>BNB</p>
                                                <svg viewBox="0 0 24 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg" className="sc-5a69fd5e-0 fIBjTm"><path d="M8.11997 9.29006L12 13.1701L15.88 9.29006C16.27 8.90006 16.9 8.90006 17.29 9.29006C17.68 9.68006 17.68 10.3101 17.29 10.7001L12.7 15.2901C12.31 15.6801 11.68 15.6801 11.29 15.2901L6.69997 10.7001C6.30997 10.3101 6.30997 9.68006 6.69997 9.29006C7.08997 8.91006 7.72997 8.90006 8.11997 9.29006Z"></path></svg>
                                            </button>
                                        </div>
                                        <div className='flex justify-end mt-3'>
                                            <div className='flex gap-3 items-center'>
                                                <p>Balance 15.12</p> <p className='rounded-md text-xs bg-sky-500 text-sky-700'>MAX</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className='btn btn-primary'>Exchange</button>
                            </>
                        ) : ( "" )
                    }
                </div>

            </div>
        </>
    );
};

export default Exchange;