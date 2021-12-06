import React from "react";
import Logo from "../../assets/landing/white.png";

const IMG_LOC = "/nav_icons/";

export const Footer = () => {
  const navs = [
    { title: "Team", url: "team" },
    { title: "Ecosystem", url: "ecosystem" },
    { title: "Docs", url: "docs" },
  ];

  const socialMedia = [
    { icon: IMG_LOC + "github.svg", url: "https://github.com/ClamSwap-Squad", title: "Github" },
    {
      icon: IMG_LOC + "discord.svg",
      url: "https://discord.com/invite/aH6U2hjby7",
      title: "Discord",
    },
    { icon: IMG_LOC + "telegram.svg", url: "https://t.me/clamisland", title: "Telegram" },
  ];

  return (
    <footer className="landing-footer flex justify-center">
      <div className="flex flex-col items-center">
        <img className="logo mb-4" src={Logo} />
        <nav className="flex justify-between text-white mb-4 w-full">
          {navs.map((k) => (
            <p key={k.url}>{k.title}</p>
          ))}
        </nav>
        <p className="text-center text-white opacity-70 mb-4">© 2021 Clam Island, Inc</p>
        <nav className="flex justify-between text-white w-3/4" style={{ marginBottom: "20%" }}>
          {socialMedia.map((k) => (
            <a
              href={k.url}
              target="_blank"
              rel="noreferrer"
              key={k.title}
              className="social-nav-icon"
            >
              <img src={k.icon} alt={k.title} title={k.title} />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
