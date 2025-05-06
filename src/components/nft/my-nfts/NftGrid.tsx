import { Link } from "@tanstack/react-router";
import { ArrowUpDown, Eye, MoreHorizontal, Tag, Trash2 } from "lucide-react";
import Image from "~/components/Image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { NFT } from "~/types/nft";

interface IProps {
  nfts: NFT[];
  handleListNFT: (id: string) => void;
}
export function NftGrid({ nfts, handleListNFT }: IProps) {
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border p-12 text-center">
        <Image
          src="/placeholder.svg?height=100&width=100"
          alt="No NFTs"
          width={100}
          height={100}
          className="mb-4 opacity-50"
        />
        <h3 className="text-xl font-medium">No NFTs Found</h3>
        <p className="text-muted-foreground mt-2">
          You don't have any NFTs matching these filters.
        </p>
        <Link to="/marketplace">
          <Button className="mt-4">Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {nfts.map((nft) => (
        <Card key={nft.id} className="overflow-hidden transition-all hover:shadow-lg">
          <CardHeader className="p-0">
            <div className="relative">
              <Image
                src={nft.image || "/placeholder.svg"}
                alt={nft.title}
                className="w-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge className="bg-background/80 text-foreground backdrop-blur-sm">
                  {nft?.price ?? "?"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="truncate font-semibold">{nft.title}</h3>
                <p className="truncate text-xs">{nft?.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {nft.status === "owned" ? (
                    <DropdownMenuItem
                      onClick={() => handleListNFT(nft.id)}
                      className="cursor-pointer"
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      List for Sale
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem className="cursor-pointer">
                      <Tag className="mr-2 h-4 w-4" />
                      Update Listing
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Transfer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {nft.status === "listed" && (
                    <DropdownMenuItem className="text-destructive cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancel Listing
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-muted-foreground mt-2 text-sm">{nft.collection}</div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 pt-0">
            <Link
              to={`/nft/$id`}
              params={{
                id: nft.id,
              }}
            >
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" /> View
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
