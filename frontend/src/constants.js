const CONTRACT_ADDRESS = '0xeF154AF3Ad96bf1785042b2C3287269Ded6D1Cfc';

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
      dodgeChance: characterData.dodgeChance.toNumber()
    };
  };

export { CONTRACT_ADDRESS, transformCharacterData };