import { useCallback, useState } from "react";
import { TabsContent } from "~/components/ui/tabs";
import useAlchemyNft from "~/hooks/useAlchemyNft";
import ListingDialog from "./ListingDialog";
import MyNftLoading from "./MyNftLoading";
import { NftGrid } from "./NftGrid";

interface OwnedNftsProps {
  searchQuery?: string;
}
export default function OwnedNfts({ searchQuery }: OwnedNftsProps) {
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { nfts, loading } = useAlchemyNft();

  const filteredNfts = nfts.filter((nft) =>
    nft.title.toLowerCase().includes(searchQuery?.toLowerCase() || ""),
  );

  const handleListClick = useCallback((id: string) => {
    setSelectedNFT(id);
    setDialogOpen(true);
  }, []);

  if (loading) return <MyNftLoading />;

  return (
    <>
      <TabsContent value="owned" className="mt-6">
        <NftGrid
          nfts={filteredNfts}
          handleListNFT={handleListClick}
          handleCancelListNFT={() => {}}
        />
      </TabsContent>

      <ListingDialog
        nfts={filteredNfts}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        tokenId={selectedNFT}
      />
    </>
  );
}
