import { waitForTransactionReceipt } from "@wagmi/core";
import nftAbi from "abi/Shark721NFT.json";
import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { SHARK_721_ADDRESS } from "~/lib/addresses/contract";
import { config } from "~/lib/wagmi/config";

export default function useNft() {
  const { address, isConnected } = useAccount();
  const [waitForReceipt, setWaitForReceipt] = useState(false);

  const {
    data: writeHash,
    isPending: writingContract,
    writeContract,
  } = useWriteContract();

  // ========== READ FUNCTIONS ==========

  const { data: name } = useReadContract({
    address: SHARK_721_ADDRESS,
    abi: nftAbi,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    address: SHARK_721_ADDRESS,
    abi: nftAbi,
    functionName: "symbol",
  });

  const { data: balance } = useReadContract({
    address: SHARK_721_ADDRESS,
    abi: nftAbi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // ========== WRITE FUNCTIONS ==========

  const mintNew = (tokenURI: string) => {
    if (!address || !tokenURI) return;
    writeContract({
      address: SHARK_721_ADDRESS,
      abi: nftAbi,
      functionName: "mintNew",
      args: [address, tokenURI],
    });
  };

  // Optional: mint with value (if payable)
  const mintPayable = (to: string, tokenURI: string, ethAmount: string) => {
    if (!to || !tokenURI || parseFloat(ethAmount) < 0.001) return;
    writeContract({
      address: SHARK_721_ADDRESS,
      abi: nftAbi,
      functionName: "mintNew",
      args: [to, tokenURI],
      value: parseEther(ethAmount),
    });
  };

  const getTxStatus = async () => {
    if (!writeHash) return;
    setWaitForReceipt(true);
    const receipt = await waitForTransactionReceipt(config, {
      confirmations: 2,
      hash: writeHash,
    });
    setWaitForReceipt(false);
    return receipt.status;
  };

  return {
    isConnected,
    name,
    symbol,
    balance,
    mintNew,
    mintPayable,
    getTxStatus,
    writeHash,
    writingContract,
    waitForReceipt,
  };
}
