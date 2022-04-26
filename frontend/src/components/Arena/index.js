import React, { useEffect, useState } from "react";
import "./Arena.css";
import { transformEnemyData } from "../../constants";
import useGameContract from "../../hooks/useGameContract";

const Arena = ({ characterNFT, setCharacterNFT }) => {
    const gameContract = useGameContract();
    const [enemy, setEnemy] = useState(null);

    const [isAttacking, setIsAttacking] = useState("");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchEnemy = async () => {
            const enemyTxn = await gameContract.getEnemy();
            console.log("enemyTxn: ", enemyTxn);
            setEnemy(transformEnemyData(enemyTxn));
        };

        const onAttackComplete = (newEnemyHp, newPlayerHp) => {
            const enemyHp = newEnemyHp.toNumber();
            const playerHp = newPlayerHp.toNumber();
            setEnemy((prevState) => {
                return { ...prevState, hp: enemyHp };
            });
            setCharacterNFT((prevState) => {
                return { ...prevState, hp: playerHp };
            });
        };

        if (gameContract) {
            fetchEnemy();
            gameContract.on("AttackComplete", onAttackComplete);
        }

        return () => {
            if (gameContract) {
                gameContract.off("AttackComplete", onAttackComplete);
            }
        };
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

                setShowToast(true);
                setTimeout(() => {
                  setShowToast(false);
                }, 5000);
            }
        } catch (e) {
            console.log(e);
            setIsAttacking("");
        }
    };
    return (
        <div className="arena-container">
            <div className="title-container">
                <h1>⚔️ Time to Fight ⚔️</h1>
            </div>
            {isAttacking === "attacking" ? (
                <div className="attacking-container">
                    <iframe
                        src="https://giphy.com/embed/2yzGTewUsGil0LFCTv"
                        width="240"
                        height="240"
                        frameBorder="0"
                        className="giphy-embed"
                    ></iframe>
                    <h1>Attacking!</h1>
                </div>
            ) : (
                <div className="fight-container">
                    <div className="game-container">
                        <div className="hero-container">
                            {characterNFT && (
                                <div className="hero-content">
                                    <h2 className="card-name">
                                        {characterNFT.name}
                                    </h2>
                                    <div className="hero-image">
                                        <img
                                            src={characterNFT.image}
                                            alt={`Enemy ${characterNFT.name}`}
                                        />
                                        <div className="hero-hp health-bar">
                                            <progress
                                                value={characterNFT.hp}
                                                max={characterNFT.maxHp}
                                            />
                                            <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="enemy-container">
                            {enemy && (
                                <div className="enemy-content">
                                    <h2 className="card-name">{enemy.name}</h2>
                                    <div className="enemy-image">
                                        <img
                                            src={enemy.image}
                                            alt={`Enemy ${enemy.name}`}
                                        />
                                        <div className="enemy-hp health-bar">
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
            )}
            {enemy && characterNFT && (
                <div id="toast" className={showToast ? "show" : ""}>
                    <div id="desc">{`💥 ${enemy.name} was hit for ${characterNFT.attackDmg} DAMAGE!`}</div>
                </div>
            )}
        </div>
    );
};

export default Arena;
