// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// inherit from this. Thanks Open Zeppelin!
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// helper functions
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";
import "./libraries/Base64.sol";

// Contract inherit from ERC721, a standard NFT contract
contract EpicGame is ERC721 {
    // Create a schema/struct for character attributes.
    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string img;
        string charClass;
        uint hp;
        uint maxHp;
        uint attackDmg;
        uint exp;
        uint maxExp;
        uint lvl;
        uint dodgeChance;
    }

    // tokenId is NFTs unique identifier, a number that goes 0, 1, 2, 3...
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Create an array of CharacterAttributes;
    // Hold default data for characters.
    CharacterAttributes[] defaultCharacters;

    // Create mapping from nft's tokenId => that NFTs attributes.
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    // A mapping from an address => NFTs tokenId. Gives ez way to store owner of NFT and reference later.
    mapping(address => uint256) public nftHolders;

    // Data passed in to the contract when it's first created initializing the characters.
    // Actually pass values from run.js
    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        string[] memory characterClass,
        uint256[] memory characterHp,
        uint256[] memory characterDmg,
        uint256[] memory characterDodge
    ) ERC721("RANDOM HUNTER", "HNTR") {
        // Loop through characterNames, and save values in contract.
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    img: characterImageURIs[i],
                    charClass: characterClass[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDmg: characterDmg[i],
                    dodgeChance: characterDodge[i],
                    exp: 0,
                    maxExp: 100,
                    lvl: 1
                })
            );

            CharacterAttributes memory char = defaultCharacters[i];
            console.log(
                "Done initializing %s w/ HP %s, img %s",
                char.name,
                char.hp,
                char.img
            );
        }

        _tokenIds.increment();
    }

    function mintCharacterNFT(uint256 _characterIndex) external {
        // get current token id. should be 1 because we increment in constructor.
        uint256 newItemId = _tokenIds.current();

        // magical function that ssigns the tokenId to the caller's wallet address.
        _safeMint(msg.sender, newItemId);

        // we map tokenId => characterAttributes.
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            img: defaultCharacters[_characterIndex].img,
            charClass: defaultCharacters[_characterIndex].charClass,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDmg: defaultCharacters[_characterIndex].attackDmg,
            exp: defaultCharacters[_characterIndex].exp,
            maxExp: defaultCharacters[_characterIndex].maxExp,
            lvl: defaultCharacters[_characterIndex].lvl,
            dodgeChance: defaultCharacters[_characterIndex].dodgeChance
        });

        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s",
            newItemId,
            _characterIndex
        );

        // keep track who wns what NFT.
        nftHolders[msg.sender] = newItemId;

        _tokenIds.increment();
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            charAttributes.attackDmg
        );
        string memory strExp = Strings.toString(charAttributes.exp);
        string memory strMaxExp = Strings.toString(charAttributes.maxExp);
        string memory strLvl = Strings.toString(charAttributes.lvl);
        string memory strDodgeChance = Strings.toString(
            charAttributes.dodgeChance
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name":"',
                charAttributes.name,
                " -- NFT#: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in Random Hunters!", "image": "',
                charAttributes.img,
                '", "class": "',
                charAttributes.charClass,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value": ',
                strMaxHp,
                ' }, { "trait_type": "Experience Points", "value": ', 
                strExp,
                ', "max_value": ',
                strMaxExp,
                ' }, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                ' }, { "trait_type": "Dodge Chance", "value": ',
                strDodgeChance,
                ' }, { "trait_type": "Level", "value": ',
                strLvl,
                " } ]}"
            )
        );

        string memory output = string(abi.encodePacked("data:application/json;base64,", json));

        return output;
    }
}
