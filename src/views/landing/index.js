import React from "react";

import { Header } from "./header";
import { Ecosystem } from "./ecosystem";
import { Partners } from "./partners";
import { TeamAdvisors } from "./teamAdvisors";
import { Footer } from "./footer";

import "./index.scss";

export const LandingPage = () => {
  return (
    <>
      {/* <Header /> */}
      <Ecosystem />
      <Partners />
      <TeamAdvisors />
      <Footer />
    </>
  );
};
