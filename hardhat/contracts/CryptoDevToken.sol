//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";

contract CryptoDevToken is ERC20, Ownable {
	uint256 public constant tokenPrice = 0.001 ether;
	uint256 public constant tokensPerNFT = 10 * 10**18;
// ERC20 tokens have the smallest denomination of 10^(-18). This means, having a balance of (1)
// is actually equal to (10 ^ -18) tokens.  Owning 1 full token is equivalent to owning (10^18) tokens when you account for the decimal places.
	uint256 public constant maxTotalSupply = 10000 * 10**18;
	// CryptoDevsNFT contract instance
	ICryptoDevs CryptoDevsNFT;
	// Mapping to keep track of which tokenIds have been claimed
	mapping(uint256 => bool) public tokenIdsClaimed;

	constructor(address _cryptoDevsContract) ERC20("Crypto Dev Token", "CD" ) {
		CryptoDevsNFT = ICryptoDevs(_cryptoDevsContract);
	}
	      /**
       * @dev Mints `amount` number of CryptoDevTokens
       * Requirements:
       * - `msg.value` should be equal or greater than the tokenPrice * amount
       */
	
	function mint(uint256 amount) public payable {
		uint256 _requiredAmount = tokenPrice * amount;
		require(msg.value >= _requiredAmount, "Ether sent is incorrect");
		uint256 amountWithDecimals = amount * 10**18;
		require((totalSupply() + amountWithDecimals) <= maxTotalSupply, "Exceeds the max total supply available");
		_mint(msg.sender, amountWithDecimals);
	}

      /**
       * @dev Mints tokens based on the number of NFT's held by the sender
       * Requirements:
       * balance of Crypto Dev NFT's owned by the sender should be greater than 0
       * Tokens should have not been claimed for all the NFTs owned by the sender
       */
	   function claim() public {
		   address sender = msg.sender;
		   uint256 balance = CryptoDevsNFT.balanceOf(sender);
		   require(balance > 0, "You don't own any Crypto Devs NFT");
		   uint256 amount = 0;
		   for (uint256 i = 0; i < balance; i++) {
	 // loop over the balance and get the token ID owned by `sender` at a given `index` of its token list.
			   uint256 tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
	// if tokenId has not been claimed increase the amount
	if (!tokenIdsClaimed[tokenId]) {
		amount += 1;
		tokenIdsClaimed[tokenId] = true;
	}
		   }
		//    if all tokenIds have been claimed, revert the transaction
		require(amount > 0, "You have already claimed all tokens");
		_mint(msg.sender, amount * tokensPerNFT);
	   }
	        // Function to receive Ether. msg.data must be empty
	   receive() external payable {}
	   // Fallback function is called when msg.data is not empty
	   fallback() external payable {}
}
