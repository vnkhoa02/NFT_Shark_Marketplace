import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useListedNft from "~/hooks/useListedNft";
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
  const [cancelOpen, setCancelOpen] = useState(false);

  const { nfts, loading } = useMyNft(); // owned
  const { listedNfts, isMPFetching } = useListedNft(); // listed
  const handleListClick = useCallback((id: string) => {
    setSelectedNFT(id);
    setDialogOpen(true);
  }, []);

  const handleCancelClick = useCallback((id: string) => {
    setSelectedNFT(id);
    setCancelOpen(true);
  }, []);

  const filterBySearch = useCallback(
    (list: typeof nfts | typeof listedNfts) =>
      list.filter(
        (n) =>
          !searchQuery ||
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.collection.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  // 3) Memoize each tab’s data
  const ownedFiltered = useMemo(() => filterBySearch(nfts), [nfts, filterBySearch]);
  const listedFiltered = useMemo(
    () => filterBySearch(listedNfts),
    [listedNfts, filterBySearch],
  );
  const allFiltered = useMemo(
    () => [...ownedFiltered, ...listedFiltered],
    [ownedFiltered, listedFiltered],
  );

  if (loading || isMPFetching) return <MyNftLoading />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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
      <div className="mb-8">
        <div className="relative w-full md:w-1/2">
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
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)} className="mb-8">
        <TabsList>
          {["all", "owned", "listed"].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <NftGrid
            nfts={allFiltered}
            handleListNFT={handleListClick}
            handleCancelListNFT={handleCancelClick}
          />
        </TabsContent>
        <TabsContent value="owned" className="mt-6">
          <NftGrid
            nfts={ownedFiltered}
            handleListNFT={handleListClick}
            handleCancelListNFT={handleCancelClick}
          />
        </TabsContent>
        <TabsContent value="listed" className="mt-6">
          <NftGrid
            nfts={listedFiltered}
            handleListNFT={handleListClick}
            handleCancelListNFT={handleCancelClick}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ListingDialog
        nfts={nfts}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        tokenId={selectedNFT}
      />
      <CancelListingDialog
        nfts={listedNfts}
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        tokenId={selectedNFT}
      />
    </div>
  );
}
