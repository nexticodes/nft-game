import { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./App.css";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import epicGame from "./utils/EpicGame.json";

import Footer from "./components/Footer";
import Header from "./components/Header";
import SelectCharacter from "./components/SelectCharacter";
import Arena from "./components/Arena";

const App = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [characterNFT, setCharacterNFT] = useState(null);

    const isWalletConnected = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log("Make sure you have Metamask!");
                return;
            } else {
                console.log("gm world!");

                const accounts = await ethereum.request({
                    method: "eth_accounts",
                });

                if (accounts.length !== 0) {
                    const account = accounts[0];
                    console.log("Found Authorized account!", account);
                    setCurrentAccount(account);
                } else {
                    console.log("No authorized account found");
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const connectWalletAction = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert("Get Metamask");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        isWalletConnected();
        const checkConnection = async () => {
            try {
                if (window.ethereum.networkVersion !== "4") {
                    alert("Please connect to Rinkeby!");
                }
            } catch (error) {
                console.log(error);
            }
        };
        const fetchNFTMeta = async () => {
            console.log(
                "Checking for Character NFT on address:",
                currentAccount
            );
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                epicGame.abi,
                signer
            );

            const txn = await gameContract.checkIfUserHasNFT();
            if (txn.name) {
                console.log("User has Character!");
                setCharacterNFT(transformCharacterData(txn));
            } else {
                console.log("No character NFT found");
            }
        };

        if (currentAccount) {
            console.log("CurrentAccount:", currentAccount);
            fetchNFTMeta();
        }
    }, [currentAccount]);

    const renderContent = () => {
        if (!currentAccount) {
            return (
                <div className="connect-wallet-container">
                    <h1 className="header gradient-text">SimpleRPG</h1>
                    <p>A Simple RPG that has no end goal :)</p>
                    <img
                        src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
                        alt="Monty Python Gif"
                    />
                    <button
                        className="cta-button connect-wallet-button"
                        onClick={connectWalletAction}
                    >
                        Connect Wallet To Get Started
                    </button>
                </div>
            );
        } else if (currentAccount && !characterNFT) {
            return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
        } else if (currentAccount && characterNFT) {
          return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
        }
    };

    return (
        <div className="App">
            <Header />
            {renderContent()}
            <Footer />
        </div>
    );
};

export default App;
