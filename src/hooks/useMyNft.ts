import { useQuery } from "@tanstack/react-query";
import sharkNftAbi from "abi/Shark721NFT.json";
import { useAccount, usePublicClient } from "wagmi";
import { SHARK_721_ADDRESS } from "~/lib/addresses/contract";
import { NFT } from "~/types/nft";

export default function useMyNft() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const {
    data: nfts = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myNFTs", address],
    queryFn: () => fetchMyNFTs(address!),
    enabled: !!address && !!publicClient,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 2,
  });

  async function fetchNftById(tokenId: bigint | string, contractAddress?: `0x${string}`) {
    const ntf = nfts.find((n) => n.id == tokenId);
    if (ntf) return ntf;
    if (!publicClient) throw Error("publicClient required!");

    const tokenURI = (await publicClient.readContract({
      address: contractAddress ?? SHARK_721_ADDRESS,
      abi: sharkNftAbi,
      functionName: "tokenURI",
      args: [tokenId],
    })) as string;

    const response = await fetch(tokenURI);
    const metadata = await response.json();

    return {
      contractAddress: SHARK_721_ADDRESS,
      id: tokenId.toString(),
      title: metadata.name ?? metadata.title ?? `Token #${tokenId}`,
      description: metadata?.description,
      image: metadata.image ?? "",
      collection: metadata.collection || "SharkNFT",
      price: metadata.price ?? "0",
      category: metadata?.category || "",
      status: "owned",
    } as NFT;
  }

  async function fetchMyNFTs(address: `0x${string}`) {
    if (!publicClient) throw Error("publicClient required!");

    const balance = (await publicClient.readContract({
      address: SHARK_721_ADDRESS,
      abi: sharkNftAbi,
      functionName: "balanceOf",
      args: [address],
    })) as bigint;

    const nftPromises: Promise<NFT>[] = [];

    for (let i = 0n; i < balance; i++) {
      nftPromises.push(
        (async () => {
          const tokenId = (await publicClient.readContract({
            address: SHARK_721_ADDRESS,
            abi: sharkNftAbi,
            functionName: "tokenOfOwnerByIndex",
            args: [address, i],
          })) as bigint;

          const ntf = await fetchNftById(tokenId);
          return ntf;
        })(),
      );
    }

    const results = await Promise.allSettled(nftPromises);

    return results
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<NFT>).value);
  }

  return {
    address,
    nfts,
    loading,
    isError,
    error,
    fetchNftById,
  };
}
