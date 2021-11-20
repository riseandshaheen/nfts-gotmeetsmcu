import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import MyEpicNFT from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE_BUILDSPACE = 'https://twitter.com/_buildspace';
const TWITTER_HANDLE_MINE = 'https://twitter.com/riseandshaheen';
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 30;
const CONTRACT_ADDRESS = "0xBC220D00b6Ea8d0A88dcFDC3C2b3B4Bc46bCe6Ce";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [currentMintedCount, setCurrentMintedCount] = useState();
  const [isLoading, setLoading] = useState(false);

  
  const checkIfWalletIsConnected = async() => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    /*
    * User can have multiple authorized accounts, we grab the first one if its there!
    */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
          setupEventListener();
    } else {
      console.log("No authorized account found")
    }
  }

  //Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();  
      //call minted nfts count
      getNftsMintedSoFar();
    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNFT.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          getNftsMintedSoFar();
          setLoading(false);
          alert(`Successfully Minted! Here's your NFT: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNFT.abi, signer);
          
          
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.makeAnEpicNFT();
          setLoading(true);
          console.log("Mining...please wait.")
          await nftTxn.wait();
          
          setLoading(false);
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
          
          /*
          console.log("Checking how many NFTs minted so far...")
          let nftMintCount = await connectedContract.getTotalNFTsMintedSoFar();
          setCurrentMintedCount(nftMintCount.toNumber());
          */
          console.log(currentMintedCount, "minted already");
  
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        setLoading(false);
        console.log(error)
      }
  }

  const getNftsMintedSoFar = async () =>{
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNFT.abi, signer);

        console.log("Checking how many NFTs minted so far...")
        let nftMintCount = await connectedContract.getTotalNFTsMintedSoFar();
       // await nftMintCount.wait();
        setCurrentMintedCount(nftMintCount.toNumber());
        console.log(currentMintedCount, "minted already");

      } else {
        console.log("Ethereum object doesn't exist! Can't check mint count!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  //Check for login as soon as the page loads
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
    getNftsMintedSoFar();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">GOT meets MCU</p>
          <p className="sub-text">
            Each unique card. Discover your mysterious NFT today.
          </p>
          <p className="collection-link">
          Collection at 
            <a href="https://testnets.opensea.io/collection/squarenft-vpdwqgbpgo"> &#127754;</a>
            </p>
          {currentAccount &&(
          <p className="minted-status">{currentMintedCount} /{TOTAL_MINT_COUNT} minted so far.
            </p>
          )
          }
          {!currentAccount && (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
              Connect to Wallet
            </button>
          )
          }
          {currentAccount && !isLoading &&(
              <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT 
            </button>
          )
          }
          {isLoading && (
              <button className="cta-button connect-wallet-button">
              <div className="button-spinner"></div><i className="text-onloading">Minting</i>
            </button>)

          }
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <p className="footer-text">by&nbsp;</p>
          <a
            className="footer-text"
            href={TWITTER_HANDLE_MINE}
            target="_blank"
            rel="noreferrer"
          > shaheen </a>
          <p className="footer-text">&nbsp;++&nbsp;</p>
          <a
            className="footer-text"
            href={TWITTER_HANDLE_BUILDSPACE}
            target="_blank"
            rel="noreferrer"
          >buildspace</a>
        </div>
      </div>
    </div>
  );
};

export default App;
