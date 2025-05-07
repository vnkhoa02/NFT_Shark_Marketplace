import sharkNftAbi from "abi/Shark721NFT.json";
import { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { SHARK_721_ADDRESS } from "~/lib/addresses/contract";

export default function useNft() {
  const { address, isConnected } = useAccount();
  const [waitForReceipt, setWaitForReceipt] = useState(false);

  const {
    data: writeHash,
    isPending: writingContract,
    error,
    writeContract,
  } = useWriteContract();

  // ========== READ FUNCTIONS ==========

  const { data: name } = useReadContract({
    address: SHARK_721_ADDRESS,
    abi: sharkNftAbi,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    address: SHARK_721_ADDRESS,
    abi: sharkNftAbi,
    functionName: "symbol",
  });

  // ========== WRITE FUNCTIONS ==========

  const mintNew = (tokenURI: string) => {
    if (!address || !tokenURI) return;
    writeContract({
      address: SHARK_721_ADDRESS,
      abi: sharkNftAbi,
      functionName: "mintNew",
      args: [address, tokenURI],
      value: 0n,
    });
  };

  return {
    isConnected,
    name,
    symbol,
    mintNew,
    setWaitForReceipt,
    error,
    writeHash,
    writingContract,
    waitForReceipt,
  };
}
