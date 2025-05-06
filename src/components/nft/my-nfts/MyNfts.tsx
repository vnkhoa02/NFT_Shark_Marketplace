import { Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useMyNft from "~/hooks/useMyNft";
import MyNftLoading from "./MyNftLoading";
import { NftGrid } from "./NftGrid";

export default function MyNFTs() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recently-added");
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [listPrice, setListPrice] = useState("");

  const { nfts, loading } = useMyNft();

  const filteredNFTs = nfts
    .filter((nft) => {
      if (activeTab === "all") return true;
      if (activeTab === "art") return nft.category === "Digital Art";
      if (activeTab === "sports") return nft.category === "Sports";
      return true;
    })
    .filter((nft) => {
      if (!searchQuery) return true;
      return (
        nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.collection.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  // Sort NFTs based on sort order
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    if (sortOrder === "a-z") {
      return a.title.localeCompare(b.title);
    }
    if (sortOrder === "z-a") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const handleListNFT = (id: string) => {
    setSelectedNFT(id);
    setIsListDialogOpen(true);
  };

  const handleListSubmit = () => {
    // In a real app, this would call an API to list the NFT
    console.log(`Listing NFT ${selectedNFT} for ${listPrice} ETH`);
    setIsListDialogOpen(false);
    setListPrice("");
  };

  if (loading) return <MyNftLoading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">My NFTs</h1>
          <p className="text-muted-foreground">Manage your NFT collection</p>
        </div>
        <Link to="/nft/create">
          <Button>Create New NFT</Button>
        </Link>
      </div>

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
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

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
            <NftGrid nfts={sortedNFTs} handleListNFT={handleListNFT} />
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List NFT for Sale</DialogTitle>
            <DialogDescription>
              Set a price for your NFT to list it on the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (ETH)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Duration</Label>
              <Select defaultValue="30-days">
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-day">1 day</SelectItem>
                  <SelectItem value="3-days">3 days</SelectItem>
                  <SelectItem value="7-days">7 days</SelectItem>
                  <SelectItem value="30-days">30 days</SelectItem>
                  <SelectItem value="90-days">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleListSubmit} disabled={!listPrice}>
              List for Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
