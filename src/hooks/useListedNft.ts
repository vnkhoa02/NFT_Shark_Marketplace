import { useQuery } from "@tanstack/react-query";
import marketplaceABI from "abi/NFTMarketplace.json";
import { AbiEvent, PublicClient } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { NFTMP_ADDRESS } from "~/lib/addresses/contract";
import { ItemCanceledArgs, ItemListedArgs, NFT } from "~/types/nft";
import useMyNft from "./useMyNft";

// Config
const blockStep = 1000n;
const lookBack = 1n;

// 1) Fetch and filter logs (listed minus canceled)
async function fetchUserListedLogs(
  publicClient: PublicClient,
  seller: string,
): Promise<unknown[]> {
  const listedEvent = marketplaceABI.find(
    (f) => f.name === "ItemListed" && f.type === "event",
  ) as AbiEvent;
  const canceledEvent = marketplaceABI.find(
    (f) => f.name === "ItemCanceled" && f.type === "event",
  ) as AbiEvent;

  const latestBlock = await publicClient.getBlockNumber();
  const earliestBlock = latestBlock - lookBack * blockStep;

  // helper to load logs for an event
  const loadLogs = async (event: AbiEvent) => {
    const logs: unknown[] = [];
    for (let to = latestBlock; to >= earliestBlock; to -= blockStep) {
      const from = to >= blockStep ? to - blockStep + 1n : earliestBlock;
      const batch = await publicClient.getLogs({
        address: NFTMP_ADDRESS,
        event,
        args: { seller },
        fromBlock: from,
        toBlock: to,
      });
      logs.push(...batch);
      if (from === earliestBlock) break;
    }
    return logs;
  };

  // fetch both lists
  const [listedLogs, canceledLogs] = await Promise.all([
    loadLogs(listedEvent),
    loadLogs(canceledEvent),
  ]);

  const canceledSet = new Set(
    canceledLogs.map((log) => {
      const { nft, tokenId } = (log as { args: ItemCanceledArgs }).args;
      return `${nft.toLowerCase()}-${tokenId}`;
    }),
  );

  // filter out canceled
  return listedLogs.filter((log) => {
    const { nft, tokenId } = (log as { args: ItemListedArgs }).args;
    return !canceledSet.has(`${nft.toLowerCase()}-${tokenId}`);
  });
}

// 2) Transform logs into NFT objects
async function fetchUserListedNFTs(
  address: string,
  publicClient: PublicClient,
  fetchNftById: (
    tokenId: bigint | string,
    contract: `0x${string}`,
  ) => Promise<Omit<NFT, "contractAddress" | "price" | "category" | "status">>,
): Promise<NFT[]> {
  const logs = await fetchUserListedLogs(publicClient, address);

  const settled = await Promise.allSettled(
    logs.map(async (log) => {
      const {
        nft: contractAddress,
        tokenId,
        price,
        category,
      } = (log as { args: ItemListedArgs }).args;
      const metadata = await fetchNftById(tokenId, contractAddress);
      return {
        ...metadata,
        contractAddress,
        price: price.toString(),
        category,
        status: "listed",
      } as NFT;
    }),
  );

  return settled
    .filter((res): res is PromiseFulfilledResult<NFT> => res.status === "fulfilled")
    .map((res) => res.value);
}

export default function useListedNft() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { fetchNftById } = useMyNft();

  const {
    data: listedNfts = [],
    refetch: getUserListedNtfs,
    isPending: isMPFetching,
  } = useQuery({
    queryKey: ["user-listed-nfts", address, publicClient, fetchNftById],
    queryFn: () =>
      address && publicClient
        ? fetchUserListedNFTs(address, publicClient, fetchNftById)
        : Promise.resolve([]),
    enabled: !!address && !!publicClient && isConnected,
    staleTime: 30_000,
  });

  return { listedNfts, getUserListedNtfs, isMPFetching };
}
