import { useQuery } from "@tanstack/react-query";
import marketplaceABI from "abi/NFTMarketplace.json";
import nftAbi from "abi/Shark721NFT.json";
import { useState } from "react";
import { parseEther, zeroAddress } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { NFTMP_ADDRESS } from "~/lib/addresses/contract";
import { convertOwnedNftToNFT } from "~/lib/utils/ntf";
import { getTxStatus } from "~/lib/wagmi/utils";
import { OwnedNft } from "~/types/alchemy.nft";
import { NFT } from "~/types/nft";

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

  const { data: listedNtfs = [], isLoading: isLoadingListedNft } = useQuery({
    queryKey: ["myListedNFTs", address],
    queryFn: () => fetchUserListedNFTs(),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 2,
  });

  const fetchUserListedNFTs = async (): Promise<NFT[]> => {
    const response = await fetch(`/api/nfts?owner=${address}&listed=true`).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    });
    const ownedNfts = response?.ownedNfts as OwnedNft[];
    return ownedNfts.map((n) => convertOwnedNftToNFT(n));
  };

  const listingNft = async (
    nftAddress: string,
    tokenId: string,
    amount: string,
    category = "",
  ) => {
    if (!isConnected || !address || !publicClient) return;
    const approved = await publicClient.readContract({
      address: nftAddress as `0x${string}`,
      abi: nftAbi.abi,
      functionName: "getApproved",
      args: [tokenId],
    });

    if (!approved || approved == zeroAddress) {
      console.log("Waiting for approval...");
      const tx = await writeContractAsync({
        address: nftAddress as `0x${string}`,
        abi: nftAbi.abi,
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
    listedNtfs,
    isLoadingListedNft,
  };
};

export default useMarketplace;
