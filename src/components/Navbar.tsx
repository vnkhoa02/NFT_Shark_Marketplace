import { Link } from "@tanstack/react-router";
import { Bell, FishSymbol, Menu, Search } from "lucide-react";
import { useAccount } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useIsMounted } from "~/hooks/useIsMounted";
import ConnectWallet from "./ConnectWallet";

function RightNav() {
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();
  if (!isMounted) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="relative hidden w-full md:flex md:w-auto md:max-w-sm md:flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search NFTs, collections, events..."
          className="pl-8"
        />
      </div>

      {isConnected ? (
        <>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0">
              3
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>Me</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/nft/my-nfts" className="w-full">
                  My NFTs
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <Link to="/my-bets" className="w-full">
                  My Bets
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ConnectWallet />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <ConnectWallet />
        </div>
      )}
    </div>
  );
}
export function Navbar() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>NFT Shark</SheetTitle>
                <SheetDescription>NFT Marketplace & Sports Betting</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link
                  to="/"
                  className="hover:bg-accent rounded-md px-4 py-2 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/marketplace"
                  className="hover:bg-accent rounded-md px-4 py-2 text-sm font-medium"
                >
                  Marketplace
                </Link>
                <Link
                  to="/betting"
                  className="hover:bg-accent rounded-md px-4 py-2 text-sm font-medium"
                >
                  Sports Betting
                </Link>
                <Link
                  to="/collections"
                  className="hover:bg-accent rounded-md px-4 py-2 text-sm font-medium"
                >
                  Collections
                </Link>
                <Link
                  to="/nft/create"
                  className="hover:bg-accent rounded-md px-4 py-2 text-sm font-medium"
                >
                  Create
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <FishSymbol className="h-6 w-6 text-cyan-500" />
            <span className="hidden text-xl font-bold md:inline-block">NFT Shark</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/marketplace">
                  <div className={navigationMenuTriggerStyle()}>Marketplace</div>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/betting">
                  <div className={navigationMenuTriggerStyle()}>Sports Betting</div>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] grid-cols-2 gap-3 p-4 md:w-[500px] lg:w-[600px]">
                    <li>
                      <Link to="/collections">
                        <div className="hover:bg-accent block space-y-1 rounded-md p-3">
                          <div className="text-sm font-medium">Collections</div>
                          <div className="text-muted-foreground text-xs">
                            Browse popular NFT collections
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/nft/artists">
                        <div className="hover:bg-accent block space-y-1 rounded-md p-3">
                          <div className="text-sm font-medium">Artists</div>
                          <div className="text-muted-foreground text-xs">
                            Discover top NFT creators
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/betting/leagues">
                        <div className="hover:bg-accent block space-y-1 rounded-md p-3">
                          <div className="text-sm font-medium">Sports Leagues</div>
                          <div className="text-muted-foreground text-xs">
                            Bet on major sports leagues
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <RightNav />
      </div>
    </header>
  );
}
