const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
    const gameContract = await gameContractFactory.deploy(
        ['Matsumoto', 'Ylena', 'Jack'],
        ['https://i.imgur.com/JSN12tz.png', 'https://i.imgur.com/x0uajPV.png', 'https://i.imgur.com/v83cxKd.png'],
        ['Fighter', 'Marksman', 'Tank'],
        [600, 400, 750],
        [75, 100, 60],
        [40, 60, 25]
    );
    await gameContract.deployed();
    console.log("Deployed to:", gameContract.address);

    let txn;
    // mint character at index 0 from array
    txn = await gameContract.mintCharacterNFT(0);
    await txn.wait();
    console.log('Minted NFT #1');

    console.log('Awesome, all NFTs minted!')
    // get value of nft's uri.
    // tokenURI is a function on every NFT that returns the actual data attached to the NFT.
    // saying contract, get me data inside the NFT with tokenId 1.
    // which is the first minted.
    // let returnedTokenUri = await gameContract.tokenURI(1);
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