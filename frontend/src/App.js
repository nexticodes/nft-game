import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

const App = () => {
    const [currentAccount, setCurrentAccount] = useState(null);

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
    }, []);

    return (
        <div className="App">
            <Header />
            <div className="connect-wallet-container">
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
            <Footer/>
        </div>
    );
};

export default App;
