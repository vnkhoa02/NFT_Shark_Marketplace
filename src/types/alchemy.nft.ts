export interface IAlchemyNftResponse {
  ownedNfts: OwnedNft[];
  totalCount: number;
  blockHash: string;
}

export interface OwnedNft {
  contract: Contract;
  id: Id;
  balance: string;
  title: string;
  description: string;
  tokenUri: TokenUri;
  media: Medum[];
  metadata: Metadata;
  timeLastUpdated: string;
  error?: string;
  contractMetadata: ContractMetadata;
  spamInfo: SpamInfo;
}

export interface Contract {
  address: string;
}

export interface Id {
  tokenId: string;
  tokenMetadata: TokenMetadata;
}

export interface TokenMetadata {
  tokenType: string;
}

export interface TokenUri {
  gateway: string;
  raw: string;
}

export interface Medum {
  gateway: string;
  raw: string;
}

export interface Metadata {
  metadata?: unknown[];
  attributes: Attribute[];
  image?: string;
  blockchain?: string;
  royalties?: number;
  description?: string;
  title?: string;
  category?: string;
}

export interface Attribute {
  value: string;
  trait_type: string;
}

export interface ContractMetadata {
  name: string;
  symbol: string;
  totalSupply: string;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  openSea: OpenSea;
}

export interface OpenSea {
  [key: string]: unknown;
}

export interface SpamInfo {
  isSpam: string;
  classifications: unknown[];
}
