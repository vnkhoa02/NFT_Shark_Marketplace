export interface NFT {
  contractAddress: `0x${string}`;
  id: string;
  title: string;
  description?: string;
  image: string;
  collection: string;
  price?: string;
  category: string;
  status: "owned" | "listed";
}

export interface ItemListedArgs {
  nft: `0x${string}`;
  tokenId: string;
  price: bigint;
  category: string;
}

export interface ItemCanceledArgs {
  nft: string;
  tokenId: string;
  seller: `0x${string}`;
}
