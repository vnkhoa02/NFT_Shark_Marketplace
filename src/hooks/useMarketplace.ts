import type { WriteContractErrorType } from "@wagmi/core";
import marketplaceABI from "abi/NFTMarketplace.json";
import nftAbi from "abi/Shark721NFT.json";
import { parseEther } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { NFTMP_ADDRESS } from "~/lib/addresses/contract";

interface UseMarketplaceReturn {
  /**
   * List an NFT for sale
   * @param nftAddress Address of the NFT contract
   * @param tokenId Token ID to list
   * @param priceInEth Price in ETH (e.g., "0.1")
   * @param category Optional category/tag for the listing
   */
  listingNft: (
    nftAddress: string,
    tokenId: string,
    priceInEth: string,
    category?: string,
  ) => void;

  /**
   * Cancel an existing NFT listing
   * @param nftAddress Address of the NFT contract
   * @param tokenId Token ID to cancel listing for
   */
  cancelListing: (nftAddress: string, tokenId: string) => void;

  // Transaction hashes and statuses
  listHash?: `0x${string}`;
  isListing?: boolean;
  listError: WriteContractErrorType | null;

  cancelHash?: `0x${string}`;
  isCancelling: boolean;
  cancelError: WriteContractErrorType | null;
}

const useMarketplace = (): UseMarketplaceReturn => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

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

    if (!approved) {
      console.log("Waiting for approval...", approved);
      const tx = await writeContractAsync({
        address: nftAddress as `0x${string}`,
        abi: nftAbi,
        functionName: "approve",
        args: [NFTMP_ADDRESS, tokenId],
        account: address,
      });
      console.log("approved ", tx);
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
    // Expose tx info
    listHash,
    isListing,
    listError,
    cancelHash,
    isCancelling,
    cancelError,
  };
};

export default useMarketplace;
