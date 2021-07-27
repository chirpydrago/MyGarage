import React, { useState, useEffect } from "react";
import { Contract, getDefaultProvider, providers, utils } from "ethers";
import { Typography, Button, AppBar, Card, CardActions, CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container } from '@material-ui/core';
import { AddShoppingCartSharp } from '@material-ui/icons'
import useStyles from "../styles";
import StickyFooter from "./Footer";
import { config } from "../config";
import abi from "../fixtures/abi.json";
import axios from "axios";
import CenteredTabs from "./CenteredTabs";
import { white } from "chalk";
import Header from "./Header";

const provider = getDefaultProvider("rinkeby", { alchemy: config.alchemyKey })
const contract = new Contract("0x637d0e09a3aa1031ff6A9AbAE2a70Ab865974d2b",abi,provider)
const formatIpfsUrl = (url) => {return url.replace(/ipfs:\/\//g, "https://cloudflare-ipfs.com/")}
const formatWalletAddr = (wallet) => {return wallet.substring(0, 7) + '...' + wallet.substring(wallet.length - 5) }

export const HomePage = () => {
  const classes = useStyles();

  const [mintedNftState, setMintedNftState] = useState({state: "UNINITIALIZED",})

  const [purchaseState, setPurchaseState] = useState({state: "UNINITIALIZED",})
  const modalVisible =
    purchaseState.state === "PENDING_METAMASK" ||
    purchaseState.state === "PENDING_SIGNER" ||
    purchaseState.state === "PENDING_CONFIRMAION";

  const loadRobotsData = async () => {
    setMintedNftState({ state: "PENDING", });

    const totalSupply = await contract.totalSupply();
    const ids = [...Array(totalSupply.toNumber()).keys()];
    const deferredData = ids.map(async (id) => {
      const ipfsUri = await contract.tokenURI(id);
      const owner = await contract.ownerOf(id);
      const formattedUri = formatIpfsUrl(ipfsUri);
      const metadata = (await axios.get(formattedUri)).data;
      const formattedImage = formatIpfsUrl(metadata.image);
      return {
        id,
        name: metadata.name,
        image: formattedImage,
        description: metadata.description,
        owner,
      };
    });
    const data = await Promise.all(deferredData);
    setMintedNftState({ state: "SUCCESS", data, });
  };

  useEffect(() => {loadRobotsData()}, [])

  return (
    <>
      <CssBaseline />
      <Header/>
      
      <main>
        <CenteredTabs/>        
      </main>
      <StickyFooter />
    </>
  );
};

