import { useQuery } from "@tanstack/react-query";
import { NFTMP_ADDRESS } from "~/lib/addresses/contract";
import { fetchNFTs } from "~/lib/utils/nft";

export default function useListedNft() {
  const {
    data: listedNfts = [],
    isLoading: isMPFetching,
    refetch: getUserListedNtfs,
  } = useQuery({
    queryKey: ["mpNFTS"],
    queryFn: () => fetchMpNfts(),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 2,
  });

  const fetchMpNfts = async () => {
    const allNfts = await fetchNFTs(NFTMP_ADDRESS);
    return allNfts;
  };

  return { listedNfts, getUserListedNtfs, isMPFetching };
}
