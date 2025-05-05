import { waitForTransactionReceipt } from "@wagmi/core";
import sharkNftAbi from "abi/Shark721NFT.json";
import { useCallback, useEffect, useState } from "react";
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

  const mintNew = async (tokenURI: string) => {
    if (!address || !tokenURI) return;
    writeContract({
      address: SHARK_721_ADDRESS,
      abi: sharkNftAbi,
      functionName: "mintNew",
      args: [address, tokenURI],
      value: 0n,
    });
  };

  const mintPayable = (to: string, tokenURI: string, ethAmount: string) => {
    if (!to || !tokenURI || parseFloat(ethAmount) < 0.001) return;
    writeContract({
      address: SHARK_721_ADDRESS,
      abi: sharkNftAbi,
      functionName: "mintNew",
      args: [to, tokenURI],
      value: parseEther(ethAmount),
    });
  };

  const getTxStatus = useCallback(
    async (hash = writeHash) => {
      if (!hash) return;
      setWaitForReceipt(true);
      const receipt = await waitForTransactionReceipt(config, {
        confirmations: 2,
        hash,
      });
      setWaitForReceipt(false);
      return receipt.status;
    },
    [writeHash],
  );

  useEffect(() => {
    if (!writeHash) return;
    getTxStatus().then((status) => {
      if (status === "success") {
        console.log("NFT minted! 🎉");
      } else {
        console.error("Mint failed 😢");
      }
    });
  }, [getTxStatus, writeHash]);

  return {
    isConnected,
    name,
    symbol,
    mintNew,
    mintPayable,
    getTxStatus,
    error,
    writeHash,
    writingContract,
    waitForReceipt,
  };
}
