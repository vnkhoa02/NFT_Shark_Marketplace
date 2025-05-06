import { Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useMyNft from "~/hooks/useMyNft";
import ListingDialog from "./ListingDialog";
import MyNftLoading from "./MyNftLoading";
import { NftGrid } from "./NftGrid";

export default function MyNFTs() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recently-added");
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { nfts, loading } = useMyNft();

  const filtered = nfts
    .filter((nft) =>
      activeTab === "all" ? true : nft.category.toLowerCase() === activeTab,
    )
    .filter(
      (n) =>
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.collection.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "a-z") return a.title.localeCompare(b.title);
    if (sortOrder === "z-a") return b.title.localeCompare(a.title);
    return 0;
  });

  const handleListClick = (id: string) => {
    setSelectedNFT(id);
    setDialogOpen(true);
  };

  if (loading) return <MyNftLoading />;

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

      {/* Filters & Search */}
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
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recently-added">Recently Added</SelectItem>
            <SelectItem value="oldest-first">Oldest First</SelectItem>
            <SelectItem value="a-z">Name: A to Z</SelectItem>
            <SelectItem value="z-a">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Tabs & NFT Grid */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList>
          {["all", "owned", "listed"].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        {["all", "owned", "listed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <NftGrid nfts={sorted} handleListNFT={handleListClick} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Listing Dialog */}
      <ListingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        tokenId={selectedNFT}
      />
    </div>
  );
}
