
const main = async() => {
    const myContract = await hre.ethers.getContractFactory("MyEpicNFT");
   // const [owner, addr1] = await ethers.getSigners();
    
    const myDeployedContract = await myContract.deploy();
    
    await myDeployedContract.deployed();
    
    console.log("yay! contract deployed on rinkeby network at", myDeployedContract.address);
    
    //call minting function
    let txn = await myDeployedContract.makeAnEpicNFT();
    await txn.wait();
    console.log("Minted NFT #1");
    
   /* txn = await myDeployedContract.makeAnEpicNFT();
      // Wait for it to be mined.
      await txn.wait()
      console.log("Minted NFT #2");
    */
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