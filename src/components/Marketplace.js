import React, { useState, useEffect } from "react";
import { Contract, getDefaultProvider, providers, utils , ethers} from "ethers";
import { config } from "../config";
import abi from "../fixtures/abi.json";
import axios from "axios";
import { Typography, Card, CardActions, CardContent, CardMedia, Grid, Container, CardHeader, Button, CardActionArea } from '@material-ui/core';
import nft from "./Contracts";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import { connectWallet, getCurrentWalletConnected } from './Interact';

const useStyles = makeStyles(theme => ({

  media: {
    height: 100,
    width: 100,
    margin: 'auto',
    paddingTop: '56.25%',
    marginTop: '5',
    component: "img"
  },

  description: {
    variant: "p",
    color: "textSecondary",
    Align: "justify",
    height: 50
  },

  card: {
    backgroundColor: '#FFFFFF'
  },

  container: {
    marginTop: '10'
  },

  owner: {
    paddingTop: 10,
    component: 'h5',
    textAlign: 'left'
  },

  wallet: {
    component: 'p',
    textAlign: 'left',

  }


}));


const provider = getDefaultProvider("rinkeby", { alchemy: config.alchemyKey });

const formatIpfsUrl = (url) => {
  return url.replace(/ipfs:\/\//g, "https://cloudflare-ipfs.com/");
};

const formatEthAddr = (wallet) => { return wallet.substring(0, 7) + '...' + wallet.substring(wallet.length - 5) }



const Marketplace = () => {

  const [walletAddress, setWallet] = useState('');
  const [balance, setBalance] = useState('');

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWallet(walletResponse.address);
    setBalance(walletResponse.balance);
  };

  connectWalletPressed();

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);          
        } else {
          setWallet("");          
        }
      });
    }
  }

  useEffect(async () => {
    const { address, balance } = await getCurrentWalletConnected();
    setWallet(address);
    setBalance(balance);
    addWalletListener();
  }, []);

  const styles = useStyles();

  const [mintedNftState, setMintedNftState] = useState({
    state: "UNINITIALIZED",
  });

  const [purchaseState, setPurchaseState] = useState({
    state: "UNINITIALIZED",
  });

  const [transferState, setTransferState] = useState({ state: "UNINITIALIZED", });

  const modalVisible =
    purchaseState.state === "PENDING_METAMASK" ||
    purchaseState.state === "PENDING_SIGNER" ||
    purchaseState.state === "PENDING_CONFIRMAION" ||
    transferState.state === "PENDING_METAMASK" ||
    transferState.state === "PENDING_SIGNER" ||
    transferState.state === "PENDING_CONFIRMAION";

  const loadRobotsData = async () => {
    var mdata = [];
    setMintedNftState({ state: "PENDING", });

    for (let index = 0; index < nft.length; index++) {
      const addr = nft[index];
      const contract = new Contract(addr, abi, provider);
      const totalSupply = await (contract.totalSupply());
      if (totalSupply > 0) {
        const ids = [...Array(totalSupply.toNumber()).keys()];
        const deferredData = ids.map(async (id) => {
          const ipfsUri = await (contract.tokenURI(id));
          const owner = await (contract.ownerOf(id));
          const formattedUri = formatIpfsUrl(ipfsUri);
          const metadata = (await axios.get(formattedUri)).data;
          const formattedImage = formatIpfsUrl(metadata.image);
          const price = Math.floor(Math.random() * (500 - 100) + 100) / 100;
          return {
            addr,
            id,
            name: metadata.name,
            image: formattedImage,
            description: metadata.description,
            owner,
            price
          };
        });
        const data = await Promise.all(deferredData);
        //console.log(data);
        mdata.push(data);
      }
    }
    console.log(mdata);
    setMintedNftState({ state: "SUCCESS", mdata, });
  };

  useEffect(() => {
    loadRobotsData();
  }, []);


  const handlePurchase = async () => {
    const { ethereum } = window;
    if (typeof ethereum == "undefined") alert("Metamask is not detected");

    // Prompts Metamask to connect
    await ethereum.enable();

    // Create new provider from Metamask
    const provider = new providers.Web3Provider(window.ethereum);

    // Get the signer from Metamask
    const signer = provider.getSigner();

    const contract = new Contract(
      "0x637d0e09a3aa1031ff6A9AbAE2a70Ab865974d2b",
      abi,
      signer
    );

    // Call the purchase method
    setPurchaseState({ state: "PENDING_SIGNER" });
    const receipt = await contract.purchase({ value: utils.parseEther("1") });
    setPurchaseState({ state: "PENDING_CONFIRMAION" });
    const transaction = await receipt.wait();
    setPurchaseState({ state: "SUCCESS", transaction });

    // Reload the Robots
    await loadRobotsData();
  };

  const handleTransfer = async (addr,id,e) => {
    const { ethereum } = window;
    if (typeof ethereum == "undefined") alert("Metamask is not detected");

    // Prompts Metamask to connect
    await ethereum.enable();

    // Create new provider from Metamask
    const provider = new providers.Web3Provider(window.ethereum);

    // Get the signer from Metamask
    const signer = provider.getSigner();

    const contract = new Contract(
      addr,
      abi,
      signer
    );

    // 0x88e4C7FEf63bB408465BE0409D141bF4dE89c127

    // 0x24e9cae8eB8Af41bA18159717A30e560781B3480



    // Call the transfer method
    const destAddr = prompt('Please enter destination address correctly:');
    console.log(walletAddress.toString ,destAddr, addr , id);
    setTransferState({ state: "PENDING_SIGNER" });    
    const receipt = await contract.transferFrom({ from: ethers.utils.hexZeroPad(walletAddress) , to: ethers.utils.hexZeroPad(destAddr) , tokenId: id });
    setTransferState({ state: "PENDING_CONFIRMAION" });
    const transaction = await receipt.wait();
    setTransferState({ state: "SUCCESS", transaction });

    // Reload the Robots
    await loadRobotsData();
  };



  return (

    <>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
        <div></div>

        {mintedNftState.state === "PENDING" && (
          <div className="text-xl text-white">LOADING...</div>
        )}
        {mintedNftState.state === "SUCCESS" && (
          <Container className={styles.container}>
            <Grid container spacing={3} marginTop='10px'>
              {mintedNftState.mdata.map((items, index) => {
                return items.map(
                  ({ addr, id, image, name, description, owner, price }) => {
                    return (
                      <Grid item key={id} xs={12} md={3} sm={6} marginTop={'20'}>
                        {/* <NftCard card={items}/> */}
                        <Card className={styles.card}>
                          <CardHeader title={name} />
                          <CardActionArea>
                            <CardMedia
                              className={styles.media}
                              image={image}
                            // title={name}
                            />
                            <CardContent>
                              <Typography
                                className={styles.description} >
                                {description}
                              </Typography>
                              <Divider variant='hard' />
                              <div></div>
                              <div></div>
                              <div className={styles.owner}>
                                NFT Contract Address:
                              </div>
                              <div className={styles.wallet}>{formatEthAddr(addr)} / {id} </div>
                              <div className={styles.owner}>
                                Owned By:
                              </div>
                              <div className={styles.wallet}>{owner.substring(0, 7) + '...' + owner.substring(owner.length - 5)} </div>
                              <div className={styles.wallet}>Price : {price} ETH</div>
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            {walletAddress === owner && (
                              <Button
                              variant="contained"
                              size="large" 
                              color="primary" 
                              fullWidth
                              onClick={(e)=>handleTransfer(addr,id,e)}
                              >TRANSFER</Button>)}
                            {walletAddress !== owner && (<Button variant="contained" size="large" color="primary" fullWidth>BUY TOKEN</Button>)}


                          </CardActions>

                        </Card>
                      </Grid>
                    );
                  })
              }
              )}
            </Grid>
          </Container>
        )}
        <div className="mt-12">
          <button
            onClick={handlePurchase}
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Buy My Robot
          </button>
        </div>
      </div>
      {modalVisible && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            />
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >

            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    {purchaseState.state === "PENDING_METAMASK" &&
                      "Connecting Metamask..."}
                    {purchaseState.state === "PENDING_SIGNER" &&
                      "Waiting for Signed Transaction"}
                    {purchaseState.state === "PENDING_CONFIRMAION" &&
                      "Waiting for Block Confirmation"}
                    {transferState.state === "PENDING_METAMASK" &&
                      "Connecting Metamask..."}
                    {transferState.state === "PENDING_SIGNER" &&
                      "Waiting for Signed Transaction"}
                    {transferState.state === "PENDING_CONFIRMAION" &&
                      "Waiting for Block Confirmation"}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {purchaseState.state === "PENDING_METAMASK" &&
                        "Allow Metamask to connect to this application in the extension."}
                      {purchaseState.state === "PENDING_SIGNER" &&
                        "Approve the purchase transaction within the Metamask extension"}
                      {purchaseState.state === "PENDING_CONFIRMAION" &&
                        "Transaction has been sent to the blockchain. Please wait while the transaction is being confirmed."}
                      {transferState.state === "PENDING_METAMASK" &&
                        "Allow Metamask to connect to this application in the extension."}
                      {transferState.state === "PENDING_SIGNER" &&
                        "Approve the purchase transaction within the Metamask extension"}
                      {transferState.state === "PENDING_CONFIRMAION" &&
                        "Transaction has been sent to the blockchain. Please wait while the transaction is being confirmed."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>




  );
};

export default Marketplace;