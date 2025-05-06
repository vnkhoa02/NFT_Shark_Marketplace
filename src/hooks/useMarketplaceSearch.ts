import { useQuery } from "@tanstack/react-query";
import marketplaceABI from "abi/NFTMarketplace.json";
import { AbiEvent } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { NFTMP_ADDRESS } from "~/lib/addresses/contract";
import { ItemListedEvent, NFT } from "~/types/nft";
import useMyNft from "./useMyNft";

const useMarketplaceSearch = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { fetchNftById } = useMyNft();

  const {
    data: listedNfts = [],
    refetch: getUserListedNtfs,
    isPending: isMPFetching,
    isError,
  } = useQuery({
    queryKey: ["user-listed-nfts", address, publicClient],
    queryFn: () => fetchUserListedNFTs(address!),
    enabled: !!address && !!publicClient && isConnected,
    staleTime: 30_000, //  30s cache
  });

  const fetchUserListedNFTs = async (address: string): Promise<NFT[]> => {
    if (!publicClient) throw new Error("publicClient required!");

    const event = marketplaceABI.find(
      (f) => f.name === "ItemListed" && f.type === "event",
    ) as AbiEvent;

    const blockStep = 1000n;
    const lookBack = 5n;
    const latestBlock = await publicClient.getBlockNumber();
    const earliestBlock = latestBlock - lookBack * blockStep;

    const allLogs = [];

    for (let to = latestBlock; to >= earliestBlock; to -= blockStep) {
      const from = to >= blockStep ? to - blockStep + 1n : earliestBlock;
      const logs = await publicClient.getLogs({
        address: NFTMP_ADDRESS,
        event,
        args: { seller: address },
        fromBlock: from,
        toBlock: to,
      });
      allLogs.push(...logs);
      if (from === earliestBlock) break;
    }

    const nftList = await Promise.allSettled(
      allLogs.map((log) => {
        return (async () => {
          const {
            nft: contractAddress,
            tokenId,
            price,
            category,
          } = log.args as unknown as ItemListedEvent;

          // Fetch NFT metadata using tokenId and contractAddress
          const metadata = await fetchNftById(tokenId, contractAddress as `0x${string}`);

          const nft: NFT = {
            ...metadata,
            contractAddress,
            price: price.toString(),
            category,
            status: "listed",
          };
          return nft;
        })();
      }),
    );

    // Filter out successful results (fulfilled promises) and map them
    const successfulNFTs = nftList
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    return successfulNFTs;
  };

  return { listedNfts, getUserListedNtfs, isMPFetching, isError };
};

export default useMarketplaceSearch;
