import React from "react";

import Logo from "../../assets/landing/white.png";

const NAVS = [
  {
    title: "Docs",
    url: "https://clamisland.medium.com/clam-island-essential-visitors-guide-63f2a9984336",
  },
  { title: "Ecosystem", url: "#ecosystem" },
  { title: "Team", url: "#team" },
  { title: "Enter Island", url: "https://clamisland.fi/", type: "button" },
];

export const Header = () => {
  return (
    <div className="eco-header">
      <div className="header-bg" />
      <div className="header-text">
        <h3 className="heading">Place to farm both Yield and NFTs</h3>
        <p className="sub-heading">Use NFTs to boost your yield farming earnings</p>
        <a className="start-farming-btn" href="https://clamisland.fi/farms">
          Start Farming
          <svg
            className="inline-block ml-2"
            width="23"
            height="20"
            viewBox="0 0 23 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.2375 9.14531L14.2926 1.20016C14.0658 0.973364 13.7635 0.848877 13.4412 0.848877C13.1185 0.848877 12.8164 0.973543 12.5896 1.20016L11.8683 1.92168C11.6417 2.14812 11.5168 2.45057 11.5168 2.77306C11.5168 3.09536 11.6417 3.40801 11.8683 3.63445L16.5033 8.27963H1.7777C1.11377 8.27963 0.589172 8.7994 0.589172 9.4635V10.4835C0.589172 11.1477 1.11377 11.7198 1.7777 11.7198H16.5559L11.8685 16.3909C11.6418 16.6177 11.517 16.912 11.517 17.2344C11.517 17.5566 11.6418 17.8551 11.8685 18.0817L12.5898 18.8009C12.8166 19.0277 13.1187 19.1513 13.4414 19.1513C13.7637 19.1513 14.0659 19.0261 14.2927 18.7993L22.2377 10.8543C22.465 10.6268 22.5901 10.3231 22.5892 10.0003C22.5899 9.67635 22.465 9.37246 22.2375 9.14531Z"
              fill="black"
            />
          </svg>
        </a>
      </div>
      <nav className="nav flex flex-row justify-around" style={{ alignitems: "center" }}>
        <img src={Logo} className="logo flex" />
        <div className="flex flex-row" style={{ width: "40%", justifyContent: "space-evenly" }}>
          {NAVS.map((k, i) => (
            <div key={i} style={{ marginTop: k.type === "button" ? "15px" : "0px" }}>
              {k.type === "button" ? (
                <a className="start-farming-btn" href={k.url}>
                  {k.title}
                </a>
              ) : (
                <a className="nav-link" href={k.url}>
                  {k.title}
                </a>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};
