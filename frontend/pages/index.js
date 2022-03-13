export default function Home() {
  const zero = BigNumber.from(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] = useState(zero);
  const [tokenAmount, setTokenAmount] = useState(zero);
  const [tokensMinted, setTokensMinted] = useState(zero);
  const web3ModalRef = useRef();


  // getTokensToBeClaimed: checks the balance of tokens that can be claimed by the user
  const getTokensToBeClaimed = async () => {
    try {
      const provider = await getSignerOrProvider();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      const signer =  await getSignerOrProvider(true);
      const address = await signer.getAddress();
      const balance = await nftContract.balanceOf(address);
      if (balance === zero)
      {
        setTokensToBeClaimed(zero);
      }
      else {
        var amount = 0;
        for (var i = 0; i < balance; i++) {
          // For all the NFT's, check if the tokens have already been claimed
          // Only increase the amount if the tokens have not been claimed
          // for a an NFT(for a given tokenId)
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
          const claimed = await tokenContract.tokenIdsClaimed(tokenId);
          if (!claimed) {
            amount++;
          }
        }
        //tokensToBeClaimed has been initialized to a Big Number, thus we would convert amount
        // to a big number and then set its value
        setTokensToBeClaimed(BigNumber.from(amount));
      }
    } catch (err) {
      console.error(err);
      setTokensToBeClaimed(zero);
    }
  }

  //  getBalanceOfCryptoDevTokens: checks the balance of Crypto Dev Tokens's held by an address
  const getBalanceOfCryptoDevTokens = async () => {
    try {
      const provider = await getSignerOrProvider();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      const signer = await getSignerOrProvider(true);
      const address = await signer.getAddress();
      const balance = await tokenContract.balanceOf(address);
      setBalanceOfCryptoDevTokens(balance);
    } catch (err) {
      console.error(err);
      setBalanceOfCryptoDevTokens(zero);
    }
  }
    /**
   * mintCryptoDevToken: mints `amount` number of tokens to a given address
   */
  const mintCryptoDevToken = async () => {
    try {
      const signer = await getSignerOrProvider(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const value = amount * 0.001;
      const tx = await tokenContract.mint(amount, {
        value: utils.parseEther(value.toString()),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Succesfully minted Crypto Dev Tokens");
      await getBalanceOfCryptoDevTokens();
      await getTotalTokensMinted();
      await getTokensToBeMinted();
    } catch (err) {
      console.error(err);
    }
  };

  // claimCryptoDevTokens: help the user claim  Crypto Dev Tokens
  const claimCryptoDevTokens = async () => {
    try {
      const signer = await getSignerOrProvider(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const tx = await tokenContract.claim();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Succesfully claimed Crypto Dev Tokens");
      await getBalanceOfCryptoDevTokens();
      await getTotalTokensMinted();
      await getTokensToBeMinted();
    } catch (err) {
      console.error(err);
    }
 }
// getTotalTokensMinted: retrieves how many tokens have been minted till now out of the totalSupply
const getTotalTokensMinted = async () => {
  try {
    const provider = await getSignerOrProvider();
    const tokenContract = new Contract(
      TOKEN_CONTRACT_ADDRESS,
      TOKEN_CONTRACT_ABI,
      provider
    )
    const _tokensMinted = await tokenContract.totalSupply();
    setTokensMinted(_tokensMinted);
  } catch (err) {
    console.error(err);
  }
}
const getSignerOrProvider = async (needSigner = false) => {
  const provider = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);
  const { chainId } = await web3Provider.getNetwork();
  if (chainId !== 4) {
    window.alert("change the network to rinkeby");
    throw new Error("change the network to rinkeby");
  }
  if (needSigner) {
    const signer = web3Provider.getSigner();
    return signer;
  }
  return web3Provider
}

}
