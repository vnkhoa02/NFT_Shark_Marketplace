import { Nft } from "alchemy-sdk";
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
    status: "owned",
  };
}

export function convertAlchemyNftToNft(nft: Nft): NFT {
  return {
    contractAddress: nft.contract.address as `0x${string}`,
    id: nft.tokenId,
    title: nft.name ?? "Untitled",
    description: nft.description || "No description available",
    image: nft.image?.cachedUrl ?? nft.image?.originalUrl ?? "/placeholder.svg",
    collection: nft.collection?.name || "Unknown Collection",
    status: "listed",
  };
}
