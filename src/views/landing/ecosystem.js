import React from "react";

const IMG_LOC = "/landing/";

const ITEMS = [
  {
    img: IMG_LOC + "eco1.png",
    title: "Play-To-Invest",
    left: true,
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rhoncus euismod urna porta tellus vitae feugiat est, phasellus. Vitae hendrerit purus ornare arcu mattis. Lobortis risus aliquam a habitasse platea.`,
  },
  {
    img: IMG_LOC + "eco2.png",
    title: "DeFi + NFT",
    left: false,
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rhoncus euismod urna porta tellus vitae feugiat est, phasellus. Vitae hendrerit purus ornare arcu mattis. Lobortis risus aliquam a habitasse platea.`,
  },
  {
    img: IMG_LOC + "eco3.png",
    title: "Sustainable Design",
    left: true,
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rhoncus euismod urna porta tellus vitae feugiat est, phasellus. Vitae hendrerit purus ornare arcu mattis. Lobortis risus aliquam a habitasse platea.`,
  },
];

export const Ecosystem = () => {
  return (
    <div className="ecosystem flex flex-col items-center" id="ecosystem">
      <h3 className="heading">Ecosystem</h3>
      <div className="row flex flex-col items-center">
        {ITEMS.map((k, i) => (
          <div key={i} className="flex flex-row">
            {k.left ? <img className="eco-img" src={k.img} /> : ""}
            <div>
              <h3 className="heading" style={{ fontSize: "48px", marginBottom: "16px" }}>
                {k.title}
              </h3>
              <p className="eco-text">{k.text}</p>
            </div>
            {!k.left ? <img className="eco-img" src={k.img} /> : ""}
          </div>
        ))}
      </div>
      <a className="get-farming-btn" href="https://clamisland.fi/farms">
        Get farming today
        <svg
          className="inline-block ml-2"
          width="41"
          height="34"
          viewBox="0 0 41 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M39.8606 15.0352L25.4152 0.709791C25.0029 0.300871 24.4533 0.076416 23.8673 0.076416C23.2806 0.076416 22.7314 0.301193 22.319 0.709791L21.0075 2.01073C20.5954 2.419 20.3685 2.96434 20.3685 3.54579C20.3685 4.12692 20.5954 4.69064 21.0075 5.09891L29.4347 13.4744H2.66096C1.45381 13.4744 0.5 14.4115 0.5 15.6089V17.4481C0.5 18.6455 1.45381 19.6772 2.66096 19.6772H29.5303L21.0078 28.0994C20.5958 28.5083 20.3688 29.0388 20.3688 29.6203C20.3688 30.2011 20.5958 30.7393 21.0078 31.1479L22.3193 32.4447C22.7317 32.8536 23.281 33.0764 23.8676 33.0764C24.4536 33.0764 25.0032 32.8507 25.4156 32.4418L39.861 18.1166C40.2743 17.7064 40.5016 17.1588 40.5 16.5767C40.5013 15.9927 40.2743 15.4448 39.8606 15.0352Z"
            fill="white"
          />
        </svg>
      </a>
    </div>
  );
};
