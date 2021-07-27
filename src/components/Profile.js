import React, { useState, useEffect } from "react";
import { connectWallet, getCurrentWalletConnected } from './Interact';
import { Button, Container, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import '@fontsource/roboto';


const useStyles = makeStyles(theme => ({

  address: {
    fontSize: '20px',
    // //variant:"H4",
    color: "textSecondary",
    textAlign: "left",
    marginTop: '30px',
    height: 50,
    paddingLeft: 30,
    // fontFamily: 'Roboto'
  },

  owner: {
    paddingLeft: 30,
    fontSize:'15px',
    textAlign: 'left'
  },  

  container: {
    marginTop: '10'
  },

 

}));



// const provider = getDefaultProvider("rinkeby", { alchemy: config.alchemyKey });

const Profile = () => {

  const styles = useStyles();

  //const ethereum = window.ethereum
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
    const { address, balance } = await getCurrentWalletConnected();
    setWallet(address);
    setBalance(balance);
    addWalletListener();
  }, []);

  



  return (
    <>
      <Container style={{ height: '75vh' }}>
        <Grid container spacing={2} marginTop='10px'>
          <Grid item lg={6}>
            <Paper>
              <Typography className={styles.address}>
                Address:
              </Typography>
              <Typography className={styles.owner}>
                {walletAddress}
              </Typography>
            </Paper>
          </Grid>
          <Grid item lg={6}>
            <Paper>
              <Typography className={styles.address}>
                Balance:
              </Typography>
              <Typography className={styles.owner}>
                {balance} ETH
              </Typography>
            </Paper>
          </Grid>
          <Grid item lg={12}>
            {/* <Button variant="contained" onClick={handlePurchase}>
              BUY MY TOKEN
            </Button>             */}
          </Grid>
          {/* <Grid item xs={12} md={3} sm={6}>
            <Paper>4</Paper>
          </Grid> */}
        </Grid>
      </Container>


    </>
  )
}

export default Profile;

