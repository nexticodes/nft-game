// const CONTRACT_ADDRESS = "0xeF154AF3Ad96bf1785042b2C3287269Ded6D1Cfc";
const CONTRACT_ADDRESS = "0xDea9F2F68a33d9f0AEE821cBAa142f173A9783eF";

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        image: characterData.image,
        charClass: characterData.charClass,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDmg: characterData.attackDmg.toNumber(),
        exp: characterData.exp.toNumber(),
        maxExp: characterData.maxExp.toNumber(),
        lvl: characterData.lvl.toNumber(),
        dodgeChance: characterData.dodgeChance.toNumber(),
    };
};

const transformEnemyData = (enemyData) => {
    return {
        name: enemyData.name,
        image: enemyData.image,
        hp: enemyData.hp.toNumber(),
        maxHp: enemyData.maxHp.toNumber(),
        attackDmg: enemyData.attackDmg.toNumber(),
        dodgeChance: enemyData.dodgeChance.toNumber(),
    };
};

export { CONTRACT_ADDRESS, transformCharacterData, transformEnemyData };
