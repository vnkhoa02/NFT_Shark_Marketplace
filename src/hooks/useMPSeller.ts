import { useQuery } from "@tanstack/react-query";
import { NFT } from "~/types/nft";

const useMPSeller = (address: `0x${string}`) => {
  const { data: listedNtfs = [], isLoading: isLoadingListedNft } = useQuery({
    queryKey: ["sellerListedNFTs", address],
    queryFn: () => fetchUserListedNFTs(address),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 2,
  });

  const fetchUserListedNFTs = async (address: `0x${string}`): Promise<NFT[]> => {
    if (!address) return [];
    const response = await fetch(`/api/nfts/listed?owner=${address}`).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    });
    const listedNfts = response?.listedNfts;
    return listedNfts;
  };

  return {
    listedNtfs,
    isLoadingListedNft,
  };
};

export default useMPSeller;
