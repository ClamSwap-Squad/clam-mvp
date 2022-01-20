import React from "react";

export const SwapButton = ({ onClick }) => {
  return (
    <div className="w-full flex justify-center mt-4">
      <button
        className="btn btn-secondary bg-blue-700 border-blue-700 text-lg w-full"
        onClick={onClick}
      >
        Buy Now
      </button>
    </div>
  );
};
