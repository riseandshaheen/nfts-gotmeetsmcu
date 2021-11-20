
const main = async() => {
const myContract = await hre.ethers.getContractFactory("MyEpicNFT");
const accounts = await ethers.getSigners();

const myDeployedContract = await myContract.deploy();

await myDeployedContract.deployed();

console.log("yay! contract deployed at", myDeployedContract.address);

//call minting function
let txn = await myDeployedContract.makeAnEpicNFT();
await txn.wait();


txn = await myDeployedContract.connect(accounts[1]).makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();

  txn = await myDeployedContract.connect(accounts[2]).makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();

  txn = await myDeployedContract.connect(accounts[3]).makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();

  let totalmints = await myDeployedContract.getTotalNFTsMintedSoFar();
  console.log(totalmints.toNumber());
  console.log(await myDeployedContract.callStatic.getTotalNFTsMintedSoFar());

}

const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();