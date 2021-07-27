import React, { useState, useEffect } from "react";
import { Contract, getDefaultProvider, providers, utils } from "ethers";
import { config } from "../config";
import abi from "../fixtures/abi.json";
import axios from "axios";
import { Typography, AppBar, Card, CardActions, CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container, Paper, CardHeader, Button, CardActionArea } from '@material-ui/core';
import { AddShoppingCartSharp } from '@material-ui/icons'
import nft from "./Contracts";
import NftCard from "./NftCard";
import { DeleteOutlined } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";

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
    component: "p",
    Align: "justify"
  },

  card: {
    backgroundColor: '#808080'
  },

  container: {
    marginTop: '10'
  },

  owner: {
    
    textalign:'left',

  },

  wallet: {
    padding:5,

  }


}));


const provider = getDefaultProvider("rinkeby", { alchemy: config.alchemyKey });

const formatIpfsUrl = (url) => {
  return url.replace(/ipfs:\/\//g, "https://cloudflare-ipfs.com/");
};

const Marketplace = () => {

  const styles = useStyles();

  const [mintedNftState, setMintedNftState] = useState({
    state: "UNINITIALIZED",
  });

  const [purchaseState, setPurchaseState] = useState({
    state: "UNINITIALIZED",
  });
  const modalVisible =
    purchaseState.state === "PENDING_METAMASK" ||
    purchaseState.state === "PENDING_SIGNER" ||
    purchaseState.state === "PENDING_CONFIRMAION";

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
            id,
            name: metadata.name,
            image: formattedImage,
            description: metadata.description,
            owner,
            price
          };
        });
        const data = await Promise.all(deferredData);
        console.log(data);
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
                  ({ id, image, name, description, owner, price }) => {
                    return (
                      <Grid item key={id} xs={12} md={3} sm={6} zeroMinWidth>
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
                              <Typography noWrap
                                className={styles.description} >
                                {description}
                              </Typography>
                              <Divider variant='hard' />
                              <div></div>
                              <div></div>
                              <div className={styles.owner}>Owned By:</div>
                              <div className={styles.wallet}>{owner.substring(0, 7) + '...' + owner.substring(owner.length - 5)} </div>
                              <div className="text-left text-xs">Price : {price} ETH</div>
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            <Button variant="contained" size="large" color="primary" fullWidth>
                              BUY
                            </Button>
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
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {purchaseState.state === "PENDING_METAMASK" &&
                        "Allow Metamask to connect to this application in the extension."}
                      {purchaseState.state === "PENDING_SIGNER" &&
                        "Approve the purchase transaction within the Metamask extension"}
                      {purchaseState.state === "PENDING_CONFIRMAION" &&
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