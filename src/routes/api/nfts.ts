import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getChainId } from "@wagmi/core";
import { config } from "~/lib/wagmi/config";

const API_KEY = process.env.ALCHEMY_API_KEY;
const MAINNET_ENDPOINT = `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`;
const SEPOLIA_ENDPOINT = `https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`;

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
const fetchNFTs = async (owner: string): Promise<FetchNFTsResponse | undefined> => {
  const chainId = getChainId(config).toString();
  const ENDPOINT = chainId !== "1" ? SEPOLIA_ENDPOINT : MAINNET_ENDPOINT;

  try {
    const params = new URLSearchParams({ owner });
    const url = `${ENDPOINT}/getNFTs?${params.toString()}`;

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

const fetchUserListedNFTs = async (owner: string) => {
  const chainId = getChainId(config).toString();
  const ENDPOINT = chainId !== "1" ? SEPOLIA_ENDPOINT : MAINNET_ENDPOINT;

  try {
    const params = new URLSearchParams({ owner });
    const url = `${ENDPOINT}/getNFTs?${params.toString()}`;

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
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const owner = url.searchParams.get("owner");
    if (!owner)
      return json(
        {
          message: "owner is required",
        },
        {
          status: 400,
        },
      );
    const listed = url.searchParams.get("listed");
    if (listed) {
      const data = await fetchUserListedNFTs(owner);
      return json(data);
    }
    const data = await fetchNFTs(owner);
    return json(data);
  },
});
