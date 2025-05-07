import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useMarketplaceSearch from "~/hooks/useMarketplaceSearch";
import useMyNft from "~/hooks/useMyNft";
import CancelListingDialog from "./CancelListingDialog";
import ListingDialog from "./ListingDialog";
import MyNftLoading from "./MyNftLoading";
import { NftGrid } from "./NftGrid";

export default function MyNFTs() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelListDialogOpen, setCancelListDialogOpen] = useState(false);

  const { nfts, loading } = useMyNft(); // owned NFTs
  const { listedNfts, isMPFetching } = useMarketplaceSearch(); // listed NFTs

  const handleListClick = (id: string) => {
    setSelectedNFT(id);
    setDialogOpen(true);
  };

  const handleCancelListing = (id: string) => {
    setSelectedNFT(id);
    setCancelListDialogOpen(true);
  };

  const filterBySearch = (list: typeof nfts) =>
    list.filter(
      (n) =>
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.collection.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  if (loading || isMPFetching) return <MyNftLoading />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Actions */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">My NFTs</h1>
          <p className="text-muted-foreground">Manage your NFT collection</p>
        </div>
        <Link to="/nft/create">
          <Button>Create New NFT</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search by name or collection"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          {["all", "owned", "listed"].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <NftGrid
            nfts={filterBySearch([...nfts, ...listedNfts])}
            handleListNFT={handleListClick}
            handleCancelListNFT={handleCancelListing}
          />
        </TabsContent>
        <TabsContent value="owned" className="mt-6">
          <NftGrid
            nfts={filterBySearch(nfts)}
            handleListNFT={handleListClick}
            handleCancelListNFT={handleCancelListing}
          />
        </TabsContent>
        <TabsContent value="listed" className="mt-6">
          <NftGrid
            nfts={filterBySearch(listedNfts)}
            handleListNFT={handleListClick}
            handleCancelListNFT={handleCancelListing}
          />
        </TabsContent>
      </Tabs>

      <ListingDialog
        nfts={nfts}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        tokenId={selectedNFT}
      />
      <CancelListingDialog
        nfts={listedNfts}
        open={cancelListDialogOpen}
        onClose={() => setCancelListDialogOpen(false)}
        tokenId={selectedNFT}
      />
    </div>
  );
}
