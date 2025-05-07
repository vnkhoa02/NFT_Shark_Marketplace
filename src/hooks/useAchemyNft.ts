import { useState } from "react";

interface NFT {
  id: string;
  title: string;
  description: string;
  [key: string]: unknown; // Extendable for other NFT properties
}

interface FetchNFTsResponse {
  ownedNfts: NFT[];
  [key: string]: unknown; // Extendable for other response properties
}

const useAlchemyNft = () => {
  const [nfts, setNFTs] = useState<NFT[]>([]);

  const fetchNFTs = async (
    owner: string,
    contractAddress?: string,
    retryAttempt: number = 0,
  ): Promise<FetchNFTsResponse | undefined> => {
    if (retryAttempt >= 5) {
      console.error("Max retry attempts reached");
      return;
    }

    if (!owner) {
      console.error("Owner address is required");
      return;
    }

    try {
      const url = `${import.meta.env.BASE_URL}/api/ntfs?owner=${owner}&contractAddress=${contractAddress}`;
      const response = await fetch(url);
      const data: FetchNFTsResponse = await response.json();
      setNFTs(data.ownedNfts);
      return data;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return fetchNFTs(owner, contractAddress, retryAttempt + 1);
    }
  };

  return { nfts, fetchNFTs };
};

export default useAlchemyNft;
