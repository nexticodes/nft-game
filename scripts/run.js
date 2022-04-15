const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
    const gameContract = await gameContractFactory.deploy(
        ['Matsumoto', 'Ylena', 'Jack'],
        ['https://imgur.com/JSN12tz', 'https://imgur.com/x0uajPV', 'https://imgur.com/v83cxKd'],
        ['Warrior', 'Archer', 'Berserker'],
        [250, 200, 300],
        [75, 100, 50],
        [4, 5, 2]
    );
    await gameContract.deployed();
    console.log("Deployed to:", gameContract.address);

    let txn;
    // mint character at index 0 from array
    txn = await gameContract.mintCharacterNFT(0);
    await txn.wait();

    // get value of nft's uri.
    // tokenURI is a function on every NFT that returns the actual data attached to the NFT.
    // saying contract, get me data inside the NFT with tokenId 1.
    // which is the first minted.
    let returnedTokenUri = await gameContract.tokenURI(1);
    console.log("Token URI:", returnedTokenUri);

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