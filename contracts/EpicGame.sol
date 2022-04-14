// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EpicGame {

    // Create a schema/struct for character attributes.
    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string img;
        string class;
        uint hp;
        uint maxHp;
        uint attackDmg;
        uint exp;
        uint maxExp;
        uint lvl;
    }

    // Create an array of CharacterAttributes;
    // Hold default data for characters.
    CharacterAttributes[] defaultCharacters;

    // Data passed in to the contract when it's first created initializing the characters.
    // Actually pass values from run.js
    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        string[] memory characterClass,
        uint[] memory characterHp,
        uint[] memory characterDmg
    ){
        // Loop through characterNames, and save values in contract.
        for (uint i = 0; i < characterNames.length; i+=1){
            defaultCharacters.push(CharacterAttributes({
                characterIndex: i,
                name: characterNames[i],
                img: characterImageURIs[i],
                class: characterClass[i],
                hp: characterHp[i],
                attackDmg: characterDmg[i],
                maxHp: characterHp[i],
                exp: 0,
                maxExp: 100,
                lvl: 1
            }));

            CharacterAttributes memory char = defaultCharacters[i];
            console.log("Done initializing %s w/ HP %s, img %s", char.name, char.hp, char.img);
        }
    }
}