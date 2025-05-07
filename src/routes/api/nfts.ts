import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

const API_KEY = process.env.ALCHEMY_API_KEY;
const ENDPOINT = `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`;

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
const fetchNFTs = async (
  owner: string,
  contractAddress?: string,
): Promise<FetchNFTsResponse | undefined> => {
  if (!owner) {
    console.error("Owner address is required");
    return;
  }

  try {
    const url = contractAddress
      ? `${ENDPOINT}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`
      : `${ENDPOINT}/getNFTs?owner=${owner}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FetchNFTsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    throw Error;
  }
};

export const APIRoute = createAPIFileRoute("/api/nfts")({
  GET: async ({ params }) => {
    const { owner, contractAddress } = params as {
      owner: string;
      contractAddress: string;
    };
    const data = await fetchNFTs(owner, contractAddress);
    return json(data);
  },
});
