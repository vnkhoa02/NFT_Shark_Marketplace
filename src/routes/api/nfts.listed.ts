import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getChainId } from "@wagmi/core";
import { Alchemy, Network, Nft, NftContractNftsResponse } from "alchemy-sdk";
import { ethers } from "ethers";
import { NFTMP_ADDRESS, SHARK_721_ADDRESS } from "~/lib/addresses/contract";
import { config as wagmiConfig } from "~/lib/wagmi/config";

// -- Environment variables required --
const API_KEY = process.env.ALCHEMY_API_KEY;
const MAINNET_ENDPOINT = `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`;
const SEPOLIA_ENDPOINT = `https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`;

const MARKETPLACE_ABI = [
  "function getSellerListings(address seller) external view returns (uint256[] memory)",
];

// Helper to get Alchemy network from chainId
function getAlchemyNetwork(chainId: string) {
  switch (chainId) {
    case "1":
      return Network.ETH_MAINNET;
    case "11155111":
      return Network.ETH_SEPOLIA;
    // Add other networks if needed
    default:
      return Network.ETH_MAINNET;
  }
}

function getRpcUrl(chainId: string) {
  const ENDPOINT = chainId !== "1" ? SEPOLIA_ENDPOINT : MAINNET_ENDPOINT;
  return ENDPOINT;
}

// 1. Get listed token IDs for this user from your contract
async function fetchUserListedTokenIds(
  owner: string,
  provider: ethers.providers.JsonRpcProvider,
): Promise<string[]> {
  const contract = new ethers.Contract(NFTMP_ADDRESS, MARKETPLACE_ABI, provider);
  const tokenIds: ethers.BigNumberish[] = await contract.getSellerListings(owner);
  return tokenIds.map((id) => id.toString());
}

// 2. Fetch all NFTs for a collection (Alchemy SDK), then filter by tokenIds
async function fetchNFTsForTokenIds(
  alchemy: Alchemy,
  contractAddress: string,
  tokenIds: string[],
): Promise<Nft[]> {
  // Fetch all NFTs for this contract (paginated)
  let pageKey: string | undefined = undefined;
  const listedTokenIdSet = new Set(tokenIds.map((id) => BigInt(id).toString(10)));
  const nfts: Nft[] = [];
  do {
    const response: NftContractNftsResponse = await alchemy.nft.getNftsForContract(
      contractAddress,
      {
        pageKey,
      },
    );
    nfts.push(...response.nfts);
    pageKey = response.pageKey;
  } while (pageKey && nfts.length < listedTokenIdSet.size);

  return nfts;
}

const fetchUserListedNFTs = async (owner: string) => {
  const chainId = getChainId(wagmiConfig).toString();
  const alchemyNetwork = getAlchemyNetwork(chainId);
  const alchemy = new Alchemy({ apiKey: API_KEY, network: alchemyNetwork });
  const provider = new ethers.providers.JsonRpcProvider(getRpcUrl(chainId));

  // 1. Get token IDs listed by this user
  const tokenIds = await fetchUserListedTokenIds(owner, provider);
  if (!tokenIds.length) return { ownedNfts: [] };

  // 2. Fetch all NFTs for the collection (with metadata), then filter by tokenIds
  const nfts = await fetchNFTsForTokenIds(alchemy, SHARK_721_ADDRESS, tokenIds);

  return { listedNfts: nfts };
};

export const APIRoute = createAPIFileRoute("/api/nfts/listed")({
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
    const data = await fetchUserListedNFTs(owner);
    return json(data);
  },
});
