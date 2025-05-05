import { Link } from "@tanstack/react-router";
import { HeroSection } from "~/components/home/HeroSection";
import { TrendingCollections } from "~/components/home/TrendingCollections";
import { FeaturedNFTs } from "~/components/nft/FeaturedNfts";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2">
            <TabsTrigger value="marketplace">NFT Marketplace</TabsTrigger>
            <TabsTrigger value="betting">Sports Betting</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-12">
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Featured NFTs</h2>
                <Link to="/marketplace">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <FeaturedNFTs />
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Trending Collections</h2>
                <Link to="/collections">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <TrendingCollections />
            </section>
          </TabsContent>

          <TabsContent value="betting" className="space-y-12">
            <section>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-bold">Live Betting</h3>
                    <p className="text-muted-foreground">
                      Place bets on games happening right now
                    </p>
                    <Button className="mt-4 w-full">Go to Live Betting</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-bold">My Active Bets</h3>
                    <p className="text-muted-foreground">
                      Track your current bets and potential winnings
                    </p>
                    <Button className="mt-4 w-full">View My Bets</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-bold">Betting History</h3>
                    <p className="text-muted-foreground">
                      Review your past bets and performance
                    </p>
                    <Button className="mt-4 w-full">View History</Button>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
