import Web3 from "web3";
import { Contract, getDefaultProvider, providers, utils, ethers } from "ethers";
import { config } from "../config";


const provider = getDefaultProvider("rinkeby", { alchemy: config.alchemyKey });
const mprovider = new ethers.providers.Web3Provider(window.ethereum);


export const connectWallet = async () => {
  if (window.ethereum) {
    try {

      //*** using metamask */

      // const addressArray = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });

      //******************** */

      //**** using ether.js */

      await window.ethereum.enable();
      await mprovider.send("eth_requestAccounts", []);
      const signer = mprovider.getSigner();      
      const addressArray = await signer.getAddress();
      const bal = ethers.utils.formatEther( await mprovider.getBalance(addressArray));
      console.log("Account : ", await signer.getAddress());
      console.log("Balance :", bal);
      

      //******************* */


      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray,
        balance: bal
        //address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
        balance: ""
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {

      /*** using metamask */

      // const addressArray = await window.ethereum.request({
      //   method: "eth_accounts",
      // });

      /*************** */


      /**** using ether.js */

      await window.ethereum.enable();
      await mprovider.send("eth_requestAccounts", []);
      const signer = mprovider.getSigner();      
      const addressArray = await signer.getAddress();
      const bal = ethers.utils.formatEther( await mprovider.getBalance(addressArray));
      console.log("Account : ", await signer.getAddress());
      console.log("Balance :", bal);

      /***************** */

      if (addressArray.length > 0) {
        return {
          address: addressArray,
          status: "👆🏽 Write a message in the text-field above.",
          balance: bal
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
          bal:""
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};