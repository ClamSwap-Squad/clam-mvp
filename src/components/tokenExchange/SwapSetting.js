import React, {useState, useEffect} from "react";
import { connect } from "redux-zero/react";
import { actions } from "store/redux";

const SwapSetting = ({slippage, setSlipage, deadline, setDeadline}) => {

    const [isShowing, toggleModal] = useState(false);


    return (        
        <>
            <button className="sc-e72add9e-0 guttEA sc-6524afae-0 kdRdfA" scale="sm" onClick={() => {
                toggleModal(true);
            }}>
                <svg viewBox="0 0 24 24" height="24" width="24" color="textSubtle" xmlns="http://www.w3.org/2000/svg" className="sc-eaf7e66-0 bXujD">
                    <path d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H9.99996C9.74996 2 9.53996 2.18 9.50996 2.42L9.12996 5.07C8.51996 5.32 7.95996 5.66 7.43996 6.05L4.94996 5.05C4.71996 4.96 4.45996 5.05 4.33996 5.27L2.33996 8.73C2.20996 8.95 2.26996 9.22 2.45996 9.37L4.56996 11.02C4.52996 11.34 4.49996 11.67 4.49996 12C4.49996 12.33 4.52996 12.66 4.56996 12.98L2.45996 14.63C2.26996 14.78 2.21996 15.05 2.33996 15.27L4.33996 18.73C4.45996 18.95 4.72996 19.03 4.94996 18.95L7.43996 17.95C7.95996 18.35 8.51996 18.68 9.12996 18.93L9.50996 21.58C9.53996 21.82 9.74996 22 9.99996 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98ZM12 15.5C10.07 15.5 8.49996 13.93 8.49996 12C8.49996 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z">
                    </path>           
                </svg>
            </button>

            
            <div className={`n-modal ${ isShowing ? "block" : "none" }`}>
                <div className="n-modal-content">
                    <div className='flex justify-between mt-2 items-center border-b'>
                        <h1>Setting</h1>
                        <span className="text-2xl font-black" onClick={() => toggleModal(false)}>&times;</span>
                    </div>
                    <div className="mt-5">
                        <p>Slippage Tolerance</p>
                        <div className="flex justify-around gap-2 w-full mt-2">
                            <button className={`border rounded-2xl px-3 py-2 ${ slippage == 0.1 ? "bg-blue-500 text-white" : "" }`} onClick={(e) => { setSlipage(0.1) }}>0.1%</button>
                            <button className={`border rounded-2xl px-3 py-2 ${ slippage == 0.5 ? "bg-blue-500 text-white" : "" }`} onClick={(e) => { setSlipage(0.5) }}>0.5%</button>
                            <button className={`border rounded-2xl px-3 py-2 ${ slippage == 1.0 ? "bg-blue-500 text-white" : "" }`} onClick={(e) => { setSlipage(1.0) }}>1.0%</button>
                            <button className={`border rounded-2xl px-3 py-2 ${ slippage == 1.5 ? "bg-blue-500 text-white" : "" }`} onClick={(e) => { setSlipage(1.5) }}>1.5%</button>
                            {/* <p className="flex items-center border rounded-2xl px-3 ml-4 py-2"><input type="number" className="w-8" min={0} value={slippage} onChange={(e) => { setSlipage(e.target.value) }} /> %</p> */}
                        </div>
                    </div>
                    <div className="mt-5">
                        <p>Transaction deadline</p>
                        <p className="flex items-center gap-3 mt-2">
                            <input type="number" className="w-16 border rounded-2xl px-3 py-2" min={0} value={deadline} onChange={(e) => { setDeadline(e.target.value) }} /> 
                            Minutes
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
};

const mapToProps = (state) => state;
export default connect(mapToProps, actions)(SwapSetting);
