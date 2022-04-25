import { useState, useEffect } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import epicGame from "../../utils/EpicGame.json";

const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                epicGame.abi,
                signer
            );
            setGameContract(contract);
        } else {
            console.log("Ethereum object not found!");
        }
    }, []);

    useEffect(() => {
        const getCharacters = async () => {
            try {
                console.log("Getting contract characters to mint");
                const charactersTxn =
                    await gameContract.getAllDefaultCharacters();
                console.log("charactersTxn", charactersTxn);

                const characters = charactersTxn.map((c) =>
                    transformCharacterData(c)
                );
                setCharacters(characters);
            } catch (e) {
                console.log(e);
            }
        };

        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`)

            if (gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log('Character NFT: ', characterNFT)
                setCharacterNFT(transformCharacterData(characterNFT));
            }
        }

        if (gameContract) {
            getCharacters();
            gameContract.on('NFTMinted', onCharacterMint)
        }

        return () => {
            if (gameContract) {
                gameContract.off('NFTMinted', onCharacterMint);
            }
        }
    }, [gameContract, setCharacterNFT]);

    const mintCharacterNFTAction = async (characterId) => {
        try {
            if (gameContract) {
                console.log('Minting in progress');
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log('Mint TXN', mintTxn);
            }
        } catch (e) {
            console.warn('MintActionError', e)
        }
    }

    const renderCharacters = () =>
        characters.map((c, i) => (
            <div className="character-item" key={c.name}>
                <div className="name-container">
                    <p>{c.name}</p>
                </div>
                <img src={c.image} alt={c.name} />
                <button
                    type="button"
                    className="character-mint-button"
                    onClick={() => mintCharacterNFTAction(i)}
                >
                    {`Mint ${c.name}`}
                </button>
            </div>
        ));
    return (
        <div className="select-character-container">
            <h1>Choose Your Hero!</h1>
            {characters.length > 0 && (<div className="characters-container">
                {renderCharacters()}
            </div>)}
        </div>
    );
};

export default SelectCharacter;
