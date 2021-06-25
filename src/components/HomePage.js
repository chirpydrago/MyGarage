//import React from "react";
import React, { useState, useEffect } from "react";
import { Contract, getDefaultProvider, providers, utils } from "ethers";
import { config } from "../config";
import abi from "../fixtures/abi.json";
import axios from "axios";



const formatIpfsUrl = (url) => {
  return url.replace(/ipfs:\/\//g, "https://cloudflare-ipfs.com/");
};

const provider = getDefaultProvider("rinkeby",{alchemy: config.alchemyKey});
const contract = new Contract(
  "0xE355ed57069bf69Ade5Bd85fEb22349306985Cf7",
  abi,
  provider
);

/* const MOCK_DATA = [
  {
    id: 0,
    image:
      "https://gateway.pinata.cloud/ipfs/QmQKcJDTRsqVMXVev9CwBowgccskYAbXztWacPJ4nbsWPt/robots/0.png",      
    name: "Silverbolt",
    description: "Pick Me. Pick Me.",
    owner: "0xE355ed57069bf69Ade5Bd85fEb22349306985Cf7",
  },
  {
    id: 1,
    image:
      "https://gateway.pinata.cloud/ipfs/QmQKcJDTRsqVMXVev9CwBowgccskYAbXztWacPJ4nbsWPt/robots/1.png",
    name: "Optimus Prime",
    description: "Pick Me. Pick Me.",
    owner: "0xE355ed57069bf69Ade5Bd85fEb22349306985Cf7",
  },
  {
    id: 2,
    image:
      "https://gateway.pinata.cloud/ipfs/QmQKcJDTRsqVMXVev9CwBowgccskYAbXztWacPJ4nbsWPt/robots/2.png",
    name: "Megatron",
    description: "Pick Me. Pick Me.",
    owner: "0xE355ed57069bf69Ade5Bd85fEb22349306985Cf7",
  },
]; */

/* export const HomePage = () => {
  const handlePurchase = () => {
    alert("Purchasing a Robot...");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <div>ROBOTS</div>
      <div>Robot images goes here</div>
      <div onClick={handlePurchase}>Buy My Robot</div>
    </div>
  );
}; */

export const HomePage = () => {

  const [mintedNftState, setMintedNftState] = useState({
    state: "UNINITIALIZED",
  });

  const loadRobotsData = async () => {
    setMintedNftState({
      state: "PENDING",
    });
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
    setMintedNftState({
      state: "SUCCESS",
      data,
    });
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
    
    // Sends a simple transaction to an account
    await signer.sendTransaction({
      to: "0xA4bFA6B9819bc8857524eA5a6C691F045131307b",
      value: utils.parseEther("0.01"),
    });
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
        <div className="text-gray-100 text-6xl pt-28 pb-10">ROBOTS</div>
        {mintedNftState.state === "PENDING" && (
          <div className="text-xl text-white">LOADING...</div>
        )}
        {mintedNftState.state === "SUCCESS" && (
          <div className="grid grid-cols-3 gap-4">
            {mintedNftState.data.map(
              ({ id, image, name, description, owner }) => {
                return (
                  <div key={id} className="bg-white rounded p-2">
                    <img src={image} className="mx-auto p-4" alt={name} />
                    <div className="text-xl">{name}</div>
                    <div className="">{description}</div>
                    <hr className="my-4" />
                    <div className="text-left text-sm">Owned By:</div>
                    <div className="text-left text-xs">{owner}</div>
                  </div>
                );
              }
            )}
          </div>
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
    </div>
  );
};