import React, { useState, useEffect } from "react";
import { connectWallet, getCurrentWalletConnected } from './Interact';
import { Grid, Paper } from "@material-ui/core";


// const provider = getDefaultProvider("rinkeby", { alchemy: config.alchemyKey });

const Profile = () => {

  //const ethereum = window.ethereum
  const [walletAddress, setWallet] = useState('');

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWallet(walletResponse.address);
  };

  connectWalletPressed();

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          // setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          // setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      // setStatus(
      //   <p>
      //     {" "}
      //     🦊{" "}
      //     <a target="_blank" href={`https://metamask.io/download.html`}>
      //       You must install Metamask, a virtual Ethereum wallet, in your
      //       browser.
      //     </a>
      //   </p>
      // );
    }
  }

  useEffect(async () => {
    const { address } = await getCurrentWalletConnected();
    setWallet(address);
    addWalletListener();
  }, []);



  return (
    <>
    <div>
      <Grid container>
        <Grid item xs={12} md={3} sm={6}>
          <Paper>
            
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} sm={6}>
          <Paper>2</Paper>
        </Grid>
        <Grid item xs={12} md={3} sm={6}>
          <Paper>3</Paper>
        </Grid>
        <Grid item xs={12} md={3} sm={6}>
          <Paper>4</Paper>
        </Grid>
      </Grid>
    </div>

      <div>This is the Profile tab. Wallet : {5 + 2} </div>
      <div>This is another : {walletAddress}</div>
    </>
  )
}

export default Profile;

