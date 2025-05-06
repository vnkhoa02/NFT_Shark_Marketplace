export interface NFT {
  contractAddress: string;
  id: string;
  title: string;
  description?: string;
  image: string;
  collection: string;
  price?: string;
  category: string;
  status: "owned" | "listed";
}

export interface ItemListedEvent {
  nft: string;
  tokenId: string;
  price: bigint;
  category: string;
}
