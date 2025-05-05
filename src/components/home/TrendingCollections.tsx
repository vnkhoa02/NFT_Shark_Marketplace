import { Link } from "@tanstack/react-router";
import Image from "~/components/Image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";

export function TrendingCollections() {
  const collections = [
    {
      id: "1",
      name: "Crypto Punks",
      creator: "CryptoPunk Labs",
      avatar: "/placeholder.svg?height=40&width=40",
      items: 10000,
      floorPrice: "5.5 ETH",
      volume: "1.2K ETH",
      images: [
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
      ],
    },
    {
      id: "2",
      name: "Sports Legends",
      creator: "Hall of Fame",
      avatar: "/placeholder.svg?height=40&width=40",
      items: 5000,
      floorPrice: "2.2 ETH",
      volume: "850 ETH",
      images: [
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
      ],
    },
    {
      id: "3",
      name: "Digital Dreamscapes",
      creator: "ArtistCollective",
      avatar: "/placeholder.svg?height=40&width=40",
      items: 3500,
      floorPrice: "1.8 ETH",
      volume: "620 ETH",
      images: [
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
      ],
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {collections.map((collection) => (
        <Card key={collection.id}>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {collection.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-md"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Collection ${collection.name} image ${index + 1}`}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={collection.avatar || "/placeholder.svg"}
                  alt={collection.creator}
                />
                <AvatarFallback>{collection.creator.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{collection.name}</h3>
                <p className="text-muted-foreground text-sm">by {collection.creator}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 p-4 pt-0">
            <div className="grid w-full grid-cols-3 text-center">
              <div>
                <p className="text-muted-foreground text-sm">Items</p>
                <p className="font-medium">{collection.items}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Floor</p>
                <p className="font-medium">{collection.floorPrice}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Volume</p>
                <p className="font-medium">{collection.volume}</p>
              </div>
            </div>
            <Link
              to={`/collections/$id`}
              params={{
                id: collection.id,
              }}
              className="w-full"
            >
              <Button className="w-full">View Collection</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
