import React from "react";
import twitterLogo from "../assets/twitter-logo.svg";

const Footer = () => {
    const TWITTER_HANDLE = "nexticus";
    const TWITTER_LINK = `https://www.twitter.com/${TWITTER_HANDLE}`;
    return (
        <div className="footer-container">
            <img
                alt="Twitter Logo"
                className="twitter-logo"
                src={twitterLogo}
            />
            <a
                className="footer-text"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
            >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
    );
};

export default Footer;
