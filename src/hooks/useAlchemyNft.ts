import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { NFT } from "~/types/nft";

const useAlchemyNft = () => {
  const { address } = useAccount();

  const {
    data: nfts = [],
    isLoading: loading,
    refetch: getUserNFTs,
  } = useQuery({
    queryKey: ["myNFTs", address],
    queryFn: () => fetchUserNFTs(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 2,
  });

  const fetchUserNFTs = (owner: `0x${string}`): Promise<NFT[]> => {
    console.log("Fetching NFTs for address:", owner);
    return Promise.resolve([]);
  };

  const fetchNftById = (id: string, contractAddress: `0x${string}`) => {
    return nfts.find((n) => n.id === id && n.contractAddress === contractAddress);
  };

  return { getUserNFTs, fetchNftById, nfts, loading };
};

export default useAlchemyNft;
