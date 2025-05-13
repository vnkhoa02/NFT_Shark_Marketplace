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
        "https://i2.seadn.io/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/e120d5fb72ddc5691f08d8a2ec3b61/fde120d5fb72ddc5691f08d8a2ec3b61.png?w=100",
        "https://i2.seadn.io/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/5770e6107d7b5c22e3fa2251ea089a/945770e6107d7b5c22e3fa2251ea089a.png?w=100",
        "https://i2.seadn.io/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/4dcc01fad5bc2b7399a4ee29a046ea/fe4dcc01fad5bc2b7399a4ee29a046ea.png?w=100",
        "https://i2.seadn.io/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/28624a57bea7619b9962ccc5b1def0/2528624a57bea7619b9962ccc5b1def0.png?w=100",
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
        "https://i2.seadn.io/ethereum/0x59ec8e68d9caa87f6b5bc4013172c20e85ccdad0/a4690070884d0cf600c769846750044d.png?w=100",
        "https://i2.seadn.io/ethereum/0x59ec8e68d9caa87f6b5bc4013172c20e85ccdad0/7fd20124cfafc379445d22414272c99d.png?w=100",
        "https://i2.seadn.io/ethereum/0x59ec8e68d9caa87f6b5bc4013172c20e85ccdad0/88cf5665f305d36127b9e959e55bbea1.png?w=100",
        "https://i2.seadn.io/ethereum/0x59ec8e68d9caa87f6b5bc4013172c20e85ccdad0/bf07242b27493d8a568229342d959e3b.png?w=100",
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
        "https://i2.seadn.io/base/0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50/234ff10c72edef5045e35903d3c361/7b234ff10c72edef5045e35903d3c361.png?w=100",
        "https://i2.seadn.io/base/0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50/9942fd4f4a6a0c3bb56da2c58674a1/179942fd4f4a6a0c3bb56da2c58674a1.png?w=100",
        "https://i2.seadn.io/base/0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50/9db291388f9d12dd1f139ff9553bf1/5c9db291388f9d12dd1f139ff9553bf1.png?w=100",
        "https://i2.seadn.io/base/0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50/066f9853e4ea0a1e3a3401332a18ab/e4066f9853e4ea0a1e3a3401332a18ab.png?w=100",
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
