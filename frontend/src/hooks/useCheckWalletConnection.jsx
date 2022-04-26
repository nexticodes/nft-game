import React from "react";

const useCheckEthereum = () => {
    const { ethereum } = window;
    if (!ethereum) {
        alert("Get Metamask");
        return false;
    }
    return ethereum;
};

const useCheckWalletConnection = () => {
    const [wallet, setWallet] = useState(null);

    const connectWalletAction = async () => {
        try {
            if (useCheckEthereum()) {
                const accounts = await ethereum.request({
                    method: "eth_accounts",
                });
                if (accounts.length !== 0) {
                    console.log("gm :)", accounts[0]);
                    setWallet(accounts[0]);
                } else {
                    console.log("No authorized account found");
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    return [wallet, setWallet];
};

export default useCheckWalletConnection;
