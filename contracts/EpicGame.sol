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
        string image;
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


    struct Enemy {
        string name;
        string image;
        uint hp;
        uint maxHp;
        uint attackDmg;
        uint dodgeChance;
    }

    Enemy public enemy;

    // A mapping from an address => NFTs tokenId. Gives ez way to store owner of NFT and reference later.
    mapping(address => uint256) public nftHolders;

    // Data passed in to the contract when it's first created initializing the characters.
    // Actually pass values from run.js
    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        string[] memory characterClass,
        uint[] memory characterHp,
        uint[] memory characterDmg,
        uint[] memory characterDodge,
        string[] memory enemyInfo,
        uint[] memory enemyHp,
        uint enemyDmg,
        uint enemyDodgeChance
    ) ERC721("SimpleRPG", "SMPL") {
        // Loop through characterNames, and save values in contract.

        enemy = Enemy({
            name: enemyInfo[0],
            image: enemyInfo[1],
            hp: enemyHp[0],
            maxHp: enemyHp[1],
            attackDmg: enemyDmg,
            dodgeChance: enemyDodgeChance
        });

        console.log('Done initializing Enemy %s w/ HP %s, img %s', enemy.name, enemy.hp, enemy.image);

        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    image: characterImageURIs[i],
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
                "Done initializing %s w/ HP %s, image %s",
                char.name,
                char.hp,
                char.image
            );
        }

        _tokenIds.increment();
    }

    function mintCharacterNFT(uint _characterIndex) external {
        // get current token id. should be 1 because we increment in constructor.
        uint256 newItemId = _tokenIds.current();

        // magical function that ssigns the tokenId to the caller's wallet address.
        _safeMint(msg.sender, newItemId);

        // we map tokenId => characterAttributes.
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            image: defaultCharacters[_characterIndex].image,
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
        CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

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
                ' #',
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in Simple RPG!", "image": "',
                charAttributes.image,
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

    function attackBoss() public {
        // Get state of character NFT.
        uint256 playerTokenId = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[playerTokenId];
        console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDmg);
        console.log("Boss %s haas %s HP and %s AD", enemy.name, enemy.hp, enemy.attackDmg);

        // check player hp > 0.
        require(
            player.hp > 0,
            "Error: Character is DEAD."
        );
        // check enemy hp > 0.
        require(
            enemy.hp > 0,
            "Error: Enemy is DEAD."
        );

        if (enemy.hp < player.attackDmg) {
            enemy.hp = 0;
        } else {
            enemy.hp = enemy.hp - player.attackDmg;
        }

        if (player.hp < enemy.attackDmg) {
            player.hp = 0;
        } else {
            player.hp = player.hp - enemy.attackDmg;
        }

        console.log("Player attacked enemy. Enemy HP is now: %s", enemy.hp);
        console.log("Enemy attacked Player. Player HP is now: %s", player.hp);
    }

}
