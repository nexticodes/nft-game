const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
    const gameContract = await gameContractFactory.deploy(
        ['Kenji', 'Ylena', 'Jack'],
        ['QmeFaMrNYvFhdSv3s8AdHiE4CV6zuP6xqHrYmkbW4iNxzs', 'QmW8hx3zAC3AYaj557H8K7UhHwF5KktWqhatTji1EWsDyj', 'QmXTEJERqrSHro6NhrVi68Jk79TWUh4TkNujJbcMk39kgY'],
        ['Warrior', 'Archer', 'Berserker'],
        [250, 200, 300],
        [75, 100, 50],
        [4, 5, 2],
        ['Kardel', 'QmZQwcDQjhorstksHwTuH8XJgkqKNMQnyGQE1rzd4g5EJf'],
        [2000, 2000],
        60,
        20
    );
    
    await gameContract.deployed();
    console.log("Deployed to:", gameContract.address);
    // console.log('Awesome, all NFTs minted!')

    // get value of nft's uri.
    // tokenURI is a function on every NFT that returns the actual data attached to the NFT.
    // saying contract, get me data inside the NFT with tokenId 1.
    // which is the first minted.
    // let returnedTokenUri = await gameContract.tokenURI(2);
    // console.log("Token URI:", returnedTokenUri);

}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

runMain();