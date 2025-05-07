import { IAlchemyNftResponse, OwnedNft } from "~/types/alchemy.nft";
import { NFT } from "~/types/nft";

export function convertOwnedNftToNFT(nft: OwnedNft): NFT {
  return {
    contractAddress: nft.contract.address as `0x${string}`,
    id: nft.id.tokenId,
    title: nft.title || nft.metadata?.title || "Untitled",
    description: nft.description || nft.metadata?.description,
    image: nft.metadata?.image || nft.media[0]?.gateway || "",
    collection: nft.contractMetadata?.name || "Unknown Collection",
    price: undefined, // You can populate this if you have price data
    category: nft.metadata?.category || "unknown",
    status: "owned", // Default, change if you track listings
  };
}

export const fetchNFTs = async (owner: `0x${string}`) => {
  const url = `${import.meta.env.VITE_BASE_URL}/api/nfts?owner=${owner}`;
  const response = await fetch(url);
  const data: IAlchemyNftResponse = await response.json();
  return data.ownedNfts.map((o) => convertOwnedNftToNFT(o));
};
