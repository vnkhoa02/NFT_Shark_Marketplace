import sharkNftAbi from "abi/Shark721NFT.json";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";

export default function useNft() {
  const { address, isConnected } = useAccount();
  const [waitForReceipt, setWaitForReceipt] = useState(false);

  const {
    data: writeHash,
    isPending: writingContract,
    error,
    writeContract,
  } = useWriteContract();

  const mintNew = (tokenURI: string, contractAddress: `0x${string}`) => {
    if (!address || !tokenURI) return;
    writeContract({
      address: contractAddress,
      abi: sharkNftAbi.abi,
      functionName: "mintNew",
      args: [address, tokenURI],
      value: 0n,
    });
  };

  return {
    isConnected,
    mintNew,
    setWaitForReceipt,
    error,
    writeHash,
    writingContract,
    waitForReceipt,
  };
}
