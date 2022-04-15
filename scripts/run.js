const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
    const gameContract = await gameContractFactory.deploy(
        ['Matsumoto', 'Ylena', 'Jack'],
        ['https://imgur.com/JSN12tz', 'https://imgur.com/x0uajPV', 'https://imgur.com/v83cxKd'],
        ['Warrior', 'Archer', 'Berserker'],
        [250, 200, 300],
        [75, 100, 50]
    );
    await gameContract.deployed();
    console.log("Deployed to:", gameContract.address);
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