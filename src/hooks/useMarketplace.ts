import marketplaceABI from "abi/NFTMarketplace.json";
import nftAbi from "abi/Shark721NFT.json";
import { useState } from "react";
import { parseEther, zeroAddress } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { NFTMP_ADDRESS } from "~/lib/addresses/contract";
import { getTxStatus } from "~/lib/wagmi/utils";

const useMarketplace = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [waitForReceipt, setWaitForReceipt] = useState(false);

  // Prepare "listItem" transaction
  const {
    data: listHash,
    isPending: isListing,
    error: listError,
    writeContract: writeList,
    writeContractAsync,
  } = useWriteContract();

  // Prepare "cancelListing" transaction
  const {
    data: cancelHash,
    isPending: isCancelling,
    error: cancelError,
    writeContract: writeCancel,
  } = useWriteContract();

  const listingNft = async (
    nftAddress: string,
    tokenId: string,
    amount: string,
    category = "",
  ) => {
    if (!isConnected || !address || !publicClient) return;
    const approved = await publicClient.readContract({
      address: nftAddress as `0x${string}`,
      abi: nftAbi,
      functionName: "getApproved",
      args: [tokenId],
    });

    if (!approved || approved == zeroAddress) {
      console.log("Waiting for approval...");
      const tx = await writeContractAsync({
        address: nftAddress as `0x${string}`,
        abi: nftAbi,
        functionName: "approve",
        args: [NFTMP_ADDRESS, tokenId],
        account: address,
      });
      const status = await getTxStatus(tx);
      if (status != "success") return;
    }
    writeList({
      address: NFTMP_ADDRESS,
      abi: marketplaceABI,
      functionName: "listItem",
      args: [nftAddress, BigInt(tokenId), parseEther(amount), category],
    });
  };

  const cancelListing = (nftAddress: string, tokenId: string) => {
    if (!isConnected || !address) return;

    writeCancel({
      address: NFTMP_ADDRESS,
      abi: marketplaceABI,
      functionName: "cancelListing",
      args: [nftAddress, BigInt(tokenId)],
    });
  };

  return {
    listingNft,
    cancelListing,
    waitForReceipt,
    setWaitForReceipt,
    listHash,
    isListing,
    listError,
    cancelHash,
    isCancelling,
    cancelError,
  };
};

export default useMarketplace;
