import { OwnedNft } from "~/types/alchemy.nft";
import { NFT } from "~/types/nft";

export function convertOwnedNftToNFT(nft: OwnedNft): NFT {
  return {
    contractAddress: nft.contract.address as `0x${string}`,
    id: nft.id.tokenId,
    title: nft.title || nft.metadata?.title || "Untitled",
    description: nft.description || nft.metadata?.description,
    image: nft.media[0]?.raw ?? "/placeholder.svg",
    collection: nft.contractMetadata?.name || "Unknown Collection",
    status: "owned", // Default, change if you track listings
  };
}
