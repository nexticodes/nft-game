import React from "react";
import "./Header.css";

const Header = ({currentAccount}) => {
    return (
        <div className="header-container">
            <img className="account-logo"
            src="https://pbs.twimg.com/profile_images/1498454186840657920/8qmGq8sE_400x400.jpg" onClick={() => {console.log('opening menu')}} />
            <button className="button disconnect">Disconnect</button>
        </div>
    );
};

export default Header;
