import React from "react";
import "./compStyle.css";



function ReusableComp() {
  return (
    <>
      {/* main card */}
      <div className="card mt-8 shadow-2xl w-96 px-8 mx-auto">
        <h2 className="card-title text-gray-500 text-2xl mb-4 font-bold  tracking-wide mt-8 mx-auto ">
          Exchange tokens
        </h2>
        {/* first card */}
        <div className="card shadow">
          <h4 className="card-title font-bold pt-2 ml-2">BNB</h4>
          <div className="card_wrap  flex items-end flex-1   ml-2 mr-1   ">
            <div className="avatar flex-1">
              <div className="rounded-full w-7 h-7">
                <img src="src\assets\img\binance-coin-bnb-logo.png" alt="icon" />
              </div>
              <p id="triangle-down" class="ml-2 mt-4">


              </p>
              <h2 className="card-title text-gray-500 ml-5 font-bold text-2xl  ">
                0.00
              </h2>
            </div>
            <div className="price">
              <h4 className="card-title text-sm font-bold  text-gray-500 mr-1 ">
                ($0.00 )
              </h4>
            </div>
          </div>
        </div>
        {/* divider */}
        <div className="line mx-auto   py-8  w-72 my-auto ">
          <button className="btn  ml-60 -mt-3.5 bg-white hover:bg-white border-1 border-gray-400 absolute btn-circle btn-sm">
            <i className="fas color fa-sync" />
            {/* replace with your refresh/sync button of your choice and remove line 35 completely */}
          </button>
          <hr />
        </div>
        {/* divider */}
        {/* second card */}
        <div className="card shadow mt-0 ">
          <h4 className="card-title font-bold pt-2 ml-2">$GEM</h4>
          <div className="card_wrap  flex items-end flex-1   ml-2 mr-1   ">
            <div className="avatar flex-1">
              <div className="rounded-full w-7 h-7">
                <img src="src\assets\clam-icon.png" alt="icon" />
              </div>
              <p id="triangle-down" class="ml-2 mt-4"></p>
              <h2 className="card-title text-gray-500 ml-5 font-bold text-2xl  ">
                0.00
              </h2>
            </div>
            <div className="price">
              <h4 className="card-title  text-gray-500 mr-1 text-sm font-bold ">
                ($0.00)
              </h4>
            </div>
          </div>
        </div>
        {/* Buy now Button */}
        <button className="btn  bg-blue-600 hover:bg-blue-600 mx-auto rounded-2xl w-72 btn-xs mt-4 mb-8  btn-primary md:btn-sm lg:btn-md xl:btn-md">
          Buy Now
        </button>
      </div>
    </>
  );
}

export default ReusableComp;
