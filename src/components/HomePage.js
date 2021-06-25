import React from "react";

const MOCK_DATA = [
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
];

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
  const handlePurchase = () => {
    alert("Purchasing a Robot...");
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
        <div className="text-gray-100 text-6xl pt-28 pb-10">ROBOTS</div>
        <div className="grid grid-cols-3 gap-4">
          {MOCK_DATA.map(({ id, image, name, description, owner }) => {
            return (
              <div key={id} className="bg-white rounded p-2">
                <img src={image} className="mx-auto p-4" />
                <div className="text-xl">{name}</div>
                <div className="">{description}</div>
                <hr className="my-4" />
                <div className="text-left text-sm">Owned By:</div>
                <div className="text-left text-xs">{owner}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-12">
          <button
            onClick={handlePurchase}
            type="button"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Buy My Robot
          </button>
        </div>
      </div>
    </div>
  );
};