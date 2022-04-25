import React, { useEffect, useState } from "react";
import "./Arena.css";
import {
    transformEnemyData,
} from "../../constants";
import useGameContract from "../../hooks/useGameContract";

const Arena = ({ characterNFT }) => {
    const gameContract = useGameContract();
    const [enemy, setEnemy] = useState(null);

    const [isAttacking, setIsAttacking] = useState("");

    useEffect(() => {
        const fetchEnemy = async () => {
            const enemyTxn = await gameContract.getEnemy();
            console.log("enemyTxn: ", enemyTxn);
            setEnemy(transformEnemyData(enemyTxn));
        };
        if (gameContract) {
            fetchEnemy();
        }
    }, [gameContract]);


    const runAttackAction = async () => {
        try {
            if (gameContract) {
                setIsAttacking("attacking");
                console.log("Attacking");
                const attackTxn = await gameContract.attackBoss();
                await attackTxn.wait();
                console.log("attackTxn: ", attackTxn);
                setIsAttacking("hit");
            }
        } catch (e) {
            console.log(e);
            setIsAttacking("");
        }
    };
    return (
        <div className="arena-container">
            <div className="title-container">
                <h1>⚔️ Welcome to the Arena ⚔️</h1>
            </div>
            <div className="game-container">
                <div className="hero-container">
                { characterNFT && (<div className="hero-content">
                        <h2>{characterNFT.name}</h2>
                        <div className="hero-image">
                            <img
                                src={characterNFT.image}
                                alt={`Enemy ${characterNFT.name}`}
                            />
                            <div className="hero-hp">
                                <progress
                                    value={characterNFT.hp}
                                    max={characterNFT.maxHp}
                                />
                                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                            </div>
                        </div>
                    </div>)}
                </div>
                <div className="enemy-container">
                    {enemy && (
                        <div className="enemy-content">
                            <h2>{enemy.name}</h2>
                            <div className="enemy-image">
                                <img
                                    src={enemy.image}
                                    alt={`Enemy ${enemy.name}`}
                                />
                                <div className="enemy-hp">
                                    <progress
                                        value={enemy.hp}
                                        max={enemy.maxHp}
                                    />
                                    <p>{`${enemy.hp} / ${enemy.maxHp} HP`}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="options-container">
                <button className="button" onClick={runAttackAction}>
                    {`Attack Enemy!!`}
                </button>
            </div>
        </div>
    );
};

export default Arena;
