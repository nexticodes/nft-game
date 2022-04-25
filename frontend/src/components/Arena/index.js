import React, { useEffect, useState } from "react";
import "./Arena.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData, transformEnemyData } from "../../constants";
import epicGame from "../../utils/EpicGame.json";

const Arena = ({ characterNFT }) => {
    const [gameContract, setGameContract] = useState(null);
    const [enemy, setEnemy] = useState(null)

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

    useEffect(() => {
        const fetchEnemy = async () => {
            const enemyTxn = await gameContract.getEnemy();
            console.log('enemyTxn: ', enemyTxn);
            setEnemy(transformEnemyData(enemyTxn));
        }
        if (gameContract){
            fetchEnemy()
        }
    }, [gameContract])

    const runAttackAction = async () => {

    }
    return (
        <div className="arena-container">
            <div className="title-container">
                <h1>⚔️ Welcome to the Arena ⚔️</h1>
            </div>
            <div className="game-container">
                <div className="hero-container">
                    <div className="hero-content">
                        <h2>{characterNFT.name}</h2>
                        <div className="hero-image">
                            <img src={characterNFT.image} alt={`Enemy ${characterNFT.name}`}/>
                            <div className="hero-hp">
                                <progress value={characterNFT.hp} max={characterNFT.maxHp}/>
                                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="enemy-container">
                    {enemy && (<div className="enemy-content">
                        <h2>{enemy.name}</h2>
                        <div className="enemy-image">
                            <img src={enemy.image} alt={`Enemy ${enemy.name}`}/>
                            <div className="enemy-hp">
                                <progress value={enemy.hp} max={enemy.maxHp}/>
                                <p>{`${enemy.hp} / ${enemy.maxHp} HP`}</p>
                            </div>
                        </div>
                    </div>)}
                </div>
            </div>
            <div className="options-container">
                <button className="button" onClick={runAttackAction}>
                    {`Attack ${enemy.name}!!`}
                </button>
            </div>
        </div>
    );
};

export default Arena;
