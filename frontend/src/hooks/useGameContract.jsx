import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
    CONTRACT_ADDRESS,
    transformEnemyData,
} from "../constants";
import epicGame from "../utils/EpicGame.json";

const useGameContract = () => {
    const [gameContract, setGameContract] = useState();
    useEffect(() => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                epicGame.abi,
                signer
            );
            setGameContract(gameContract);
        } else {
            console.log("Ethereum object not found");
        }
    }, []);
    return gameContract;
};

export default useGameContract;
