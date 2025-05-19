import { useQuery } from "@tanstack/react-query";
import marketplaceABI from "abi/NFTMarketplace.json";
import nftAbi from "abi/Shark721NFT.json";
import { Nft } from "alchemy-sdk";
import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { NFTMP_ADDRESS } from "~/lib/addresses/contract";
import { convertAlchemyNftToNft } from "~/lib/utils/ntf";
import { getTxStatus } from "~/lib/wagmi/utils";
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
    queryFn: () => fetchUserListedNFTs(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 2,
  });

  const fetchUserListedNFTs = async (address: `0x${string}`): Promise<NFT[]> => {
    const response = await fetch(`/api/nfts/listed?owner=${address}`).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    });
    const listedNfts = response?.listedNfts as Nft[];
    return listedNfts.map((n) => convertAlchemyNftToNft(n));
  };

  const checkApproval = async (nftAddress: `0x${string}`, tokenId: string | null) => {
    if (!isConnected || !tokenId || !publicClient) return false;
    const approved = await publicClient.readContract({
      address: nftAddress,
      abi: nftAbi.abi,
      functionName: "getApproved",
      args: [tokenId],
    });
    return approved == NFTMP_ADDRESS;
  };

  // Todo: fix this
  const approveNft = async (nftAddress: `0x${string}`) => {
    if (!isConnected || !publicClient) return false;
    console.log("Checking approval for NFT marketplace");
    // If not approved, send transaction to approve
    const tx = await writeContractAsync({
      address: nftAddress,
      abi: nftAbi.abi,
      functionName: "setApprovalForAll",
      args: [NFTMP_ADDRESS, true],
      account: address,
    });
    const status = await getTxStatus(tx);
    if (status === "success") {
      console.log("All NFTs approved for marketplace");
      return true;
    } else {
      console.log("Approval for all NFTs failed");
      return false;
    }
  };

  const listingNft = async (
    nftAddress: `0x${string}`,
    tokenId: string,
    amount: string,
  ) => {
    if (!isConnected || !address || !publicClient) return;
    const isApproved = await checkApproval(nftAddress, tokenId);
    if (!isApproved) {
      console.log("NFT not approved for marketplace");
      return;
    }
    writeList({
      address: NFTMP_ADDRESS,
      abi: marketplaceABI,
      functionName: "listItem",
      args: [nftAddress, BigInt(tokenId), parseEther(amount)],
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
    approveNft,
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
