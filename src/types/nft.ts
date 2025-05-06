export interface NFT {
  id: string;
  title: string;
  description?: string;
  image: string;
  collection: string;
  price?: string;
  category: string;
  status: 'owned' | 'listed';
}
