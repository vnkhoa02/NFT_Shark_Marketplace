import { useQuery } from "@tanstack/react-query";
import sharkNftAbi from "abi/Shark721NFT.json";
import { useAccount, usePublicClient } from "wagmi";
import { SHARK_721_ADDRESS } from "~/lib/addresses/contract";
import { NFT } from "~/types/nft";

async function fetchMyNFTs(
  address: `0x${string}`,
  publicClient: ReturnType<typeof usePublicClient>,
) {
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

        const tokenURI = (await publicClient.readContract({
          address: SHARK_721_ADDRESS,
          abi: sharkNftAbi,
          functionName: "tokenURI",
          args: [tokenId],
        })) as string;

        const response = await fetch(tokenURI);
        const metadata = await response.json();

        return {
          id: tokenId.toString(),
          title: metadata.name || `Token #${tokenId}`,
          description: metadata?.description,
          image: metadata.image || "",
          collection: metadata.collection || "SharkNFT",
          price: metadata.price || 0,
          category: metadata.category || "",
        } as NFT;
      })(),
    );
  }

  const results = await Promise.allSettled(nftPromises);

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<NFT>).value);
}

export default function useMyNft() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const {
    data: nfts = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myNFTs", address, publicClient],
    queryFn: () => fetchMyNFTs(address!, publicClient),
    enabled: !!address && !!publicClient,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 2,
  });

  return {
    address,
    nfts,
    loading,
    isError,
    error,
  };
}
