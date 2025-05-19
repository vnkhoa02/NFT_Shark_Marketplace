import { useCallback, useState } from "react";
import { TabsContent } from "~/components/ui/tabs";
import useMarketplace from "~/hooks/useMarketplace";
import CancelListingDialog from "./CancelListingDialog";
import MyNftLoading from "./MyNftLoading";
import { NftGrid } from "./NftGrid";

interface ListedNftsProps {
  searchQuery?: string;
}
export default function ListedNfts({ searchQuery }: ListedNftsProps) {
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const { listedNtfs: nfts, isLoadingListedNft: loading } = useMarketplace();

  const filteredNfts = nfts.filter((nft) =>
    nft.title.toLowerCase().includes(searchQuery?.toLowerCase() || ""),
  );

  const handleCancelClick = useCallback((id: string) => {
    setSelectedNFT(id);
    setCancelOpen(true);
  }, []);

  if (loading) return <MyNftLoading />;

  return (
    <>
      <TabsContent value="listed" className="mt-6">
        <NftGrid
          nfts={filteredNfts}
          handleListNFT={() => {}}
          handleCancelListNFT={handleCancelClick}
        />
      </TabsContent>
      <CancelListingDialog
        nfts={filteredNfts}
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        tokenId={selectedNFT}
      />
    </>
  );
}
