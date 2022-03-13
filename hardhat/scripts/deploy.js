const { ethers } = require("hardhat");
require("dotenv").config({path:".env"});
const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS} = require("../constants");

async function main() {
  const cryptoDevsNFTContract = CRYPTO_DEVS_NFT_CONTRACT_ADDRESS;
	const cryptoDevTokenContract = await ethers.getContractFactory("CryptoDevToken");
	const deployedCryptoDevTokenContract = await cryptoDevTokenContract.deploy(
	cryptoDevsNFTContract
	);

	console.log("Crypto Dev Token Contract Address:",
	deployedCryptoDevTokenContract.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
	console.error(error);
	process.exit(1);
});
