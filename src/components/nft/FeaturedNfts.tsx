import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";
import Image from "~/components/Image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";

export function FeaturedNFTs() {
  const [likedNFTs, setLikedNFTs] = useState<Record<string, boolean>>({});

  const featuredNFTs = [
    {
      id: "1",
      title: "Cosmic Voyager #42",
      image: "/placeholder.svg?height=400&width=400",
      price: "0.85 ETH",
      creator: {
        name: "ArtistOne",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Digital Art",
    },
    {
      id: "2",
      title: "Golden Slam Trophy",
      image: "/placeholder.svg?height=400&width=400",
      price: "1.2 ETH",
      creator: {
        name: "SportsCollector",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Sports Memorabilia",
    },
    {
      id: "3",
      title: "Neon Dreams #7",
      image: "/placeholder.svg?height=400&width=400",
      price: "0.65 ETH",
      creator: {
        name: "NeonArtist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Digital Art",
    },
    {
      id: "4",
      title: "Championship Ring 2023",
      image: "/placeholder.svg?height=400&width=400",
      price: "2.5 ETH",
      creator: {
        name: "LeagueLegend",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      category: "Sports Memorabilia",
    },
  ];

  const toggleLike = (id: string) => {
    setLikedNFTs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {featuredNFTs.map((nft) => (
        <Card key={nft.id} className="overflow-hidden transition-all hover:shadow-lg">
          <CardHeader className="p-0">
            <div className="relative aspect-square">
              <Image
                src={nft.image || "/placeholder.svg"}
                alt={nft.title}
                className="object-cover"
              />
              <Badge className="absolute top-2 right-2">{nft.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="truncate font-semibold">{nft.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleLike(nft.id)}
              >
                <Heart
                  className={`h-5 w-5 ${likedNFTs[nft.id] ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={nft.creator.avatar || "/placeholder.svg"}
                  alt={nft.creator.name}
                />
                <AvatarFallback>{nft.creator.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-sm">{nft.creator.name}</span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 pt-0">
            <div>
              <p className="text-muted-foreground text-sm">Current Price</p>
              <p className="font-semibold">{nft.price}</p>
            </div>
            <Link
              to={`/nft/$id`}
              params={{
                id: nft.id,
              }}
            >
              <Button size="sm">View NFT</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
