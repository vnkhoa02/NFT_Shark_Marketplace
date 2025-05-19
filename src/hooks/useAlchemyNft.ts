import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { convertOwnedNftToNFT } from "~/lib/utils/ntf";
import { OwnedNft } from "~/types/alchemy.nft";
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

  const fetchUserNFTs = async (owner: `0x${string}`): Promise<NFT[]> => {
    const response = await fetch(`/api/nfts?owner=${owner}`).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    });
    const ownedNfts = response?.ownedNfts as OwnedNft[];
    return ownedNfts.map((n) => convertOwnedNftToNFT(n));
  };

  const fetchNftById = (id: string, contractAddress: `0x${string}`) => {
    return nfts.find((n) => n.id === id && n.contractAddress === contractAddress);
  };

  return { getUserNFTs, fetchNftById, nfts, loading };
};

export default useAlchemyNft;
