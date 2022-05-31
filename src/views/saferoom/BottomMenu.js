import React, { useState } from 'react';
import { Link } from "react-router-dom";

import mobileClamIcon from "assets/img/bottommenu/clam-icon-outline.png";
import mobilePearlsIcon from "assets/img/bottommenu/pearls-icon-outline.png";
import mobileMapIcon from "assets/img/bottommenu/map.png";
import mobileSearchIcon from "assets/img/bottommenu/search.png";

const BottomMenu = ({toogleClamShowing, tooglePearlShowing }) => {

    const [isActive, setActive] = useState(1);

  return (
      <>
        <div className="bottom_menu border-t border-blue-700">
            <div className={`menu_item ${ isActive == 0 ? "active" : "" }`} onClick={() => setActive(0)}>
                <Link to="/">
                    <img src={mobileMapIcon} alt="" />
                    <p>Map</p>
                </Link>
            </div>
            <div className={`menu_item ${ isActive == 1 ? "active" : "" }`} onClick={() => setActive(1)}>
                <Link to="/saferoom/clam" onClick={() => { toogleClamShowing(false); tooglePearlShowing(false); }}>
                <img src={mobileClamIcon} alt="" />
                <p>Clams</p>
                </Link>
            </div>
            <div className={`menu_item ${ isActive == 2 ? "active" : "" }`} onClick={() => setActive(2)}>
                <Link to="/saferoom/pearl" onClick={() => { toogleClamShowing(false); tooglePearlShowing(false); }}>
                <img src={mobilePearlsIcon} alt="" />
                <p>Pearls</p>
                </Link>
            </div>
            <div className={`menu_item ${ isActive == 3 ? "active" : "" }`} onClick={() => setActive(3)}>
                <Link to="/saferoom/clam/inspect/-1">
                <img src={mobileSearchIcon} alt="" />
                <p>Inspector</p>
                </Link>
            </div>
        </div>

      </>
  );
};

export default BottomMenu;