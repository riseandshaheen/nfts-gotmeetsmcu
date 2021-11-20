// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import {Base64} from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //base SVG. Will add random words no top of it
    string baseSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = [
        "Cersei ",
        "Arya ",
        "Sansa ",
        "Daenerys ",
        "Khal Drogo ",
        "Bran ",
        "Jon ",
        "Jamie ",
        "Brienne ",
        "Eddard ",
        "Joffery ",
        "Theon ",
        "Margaery ",
        "Daario ",
        "Hodor "
    ];
    string[] secondWords = [
        "kills ",
        "marries ",
        "kissed ",
        "dumped ",
        "winks ",
        "eats ",
        "lifts ",
        "drinks ",
        "loves ",
        "poisoned ",
        "likes ",
        "hugged ",
        "smashed ",
        "DMs ",
        "bites ",
        "proposes "
    ];
    string[] thirdWords = [
        "Peter Parker",
        "Natasha Romanoff",
        "Wanda Maximoff",
        "Hulk",
        "Hawkeye",
        "Thanos",
        "Captain Marvel",
        "Nick Fury",
        "Gamora",
        "Groot",
        "Loki",
        "Tony Stark",
        "Steve Rogers",
        "Winter Soldier"
    ];

    event NewEpicNFTMinted(address sender, uint256 tokenId);
  
    uint256 TOTAL_MINT_COUNT = 30;

    // We need to pass the name of our NFTs token and it's symbol.
    constructor() ERC721("SquareNFT", "SQUARE") {
        console.log("This is my NFT contract. Woah!");
    }

    //picking random words
    function pickRandomFirstWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        // I seed the random generator. More on this in the lesson.
        uint256 rand = random(
            string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId)))
        );
        // Squash the # between 0 and the length of the array to avoid going out of bounds.
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId)))
        );
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId)))
        );
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function getTotalNFTsMintedSoFar() public view returns (uint256){
      return _tokenIds.current();
    }

    function makeAnEpicNFT() public {
        uint256 newItemId = _tokenIds.current();

        require(newItemId < TOTAL_MINT_COUNT, "Contract says NO MORE NFTs left");

        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(
            abi.encodePacked(first, second, third)
        );

        string memory finalSvg = string(
            abi.encodePacked(baseSvg, combinedWord, "</text></svg>")
        );
        console.log("\n--------------------");
        console.log(finalSvg);
        console.log("--------------------\n");

        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );

        _tokenIds.increment(); //increment so that next minted NFT has a unique ID

        emit NewEpicNFTMinted(msg.sender, newItemId); 
    }    
}
