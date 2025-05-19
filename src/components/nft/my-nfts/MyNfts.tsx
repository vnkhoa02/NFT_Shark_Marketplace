import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { default as ListedNfts, default as MyListedNfts } from "./ListedNfts";
import OwnedNfts from "./OwnedNfts";

export default function MyNFTs() {
  const [activeTab, setActiveTab] = useState("owned");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery) setSearchQuery("");
  }, [activeTab]);

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
          {["owned", "listed"].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              <p className="capitalize">{tab}</p>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="owned" className="mt-6">
          <OwnedNfts searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="listed" className="mt-6">
          <ListedNfts searchQuery={searchQuery} />
        </TabsContent>
        <MyListedNfts />
      </Tabs>
    </div>
  );
}
