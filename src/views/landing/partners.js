import React from "react";

const IMG_LOC = "/partners/";

const PARTNERS = [
  { img: IMG_LOC + "logo1.png", name: "John Smith" },
  { img: IMG_LOC + "logo3.svg", name: "John Smith" },
  { img: IMG_LOC + "logo2.svg", name: "John Smith" },
];

export const Partners = () => {
  return (
    <div className="partners flex flex-col items-center">
      <h3 className="heading">Our Partners</h3>
      <div className="partner-logos flex flex-row items-center">
        {PARTNERS.map((k, i) => (
          <img className="logo" src={k.img} key={i} />
        ))}
      </div>
    </div>
  );
};
