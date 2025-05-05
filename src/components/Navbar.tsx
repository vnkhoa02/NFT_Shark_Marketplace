import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search, ShoppingCart, Wallet } from "lucide-react";
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
  NavigationMenuLink,
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
import ConnectWallet from "./ConnectWallet";

export function Navbar() {
  const { isConnected } = useAccount();
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
            <ShoppingCart className="h-6 w-6 text-cyan-500" />
            <span className="hidden text-xl font-bold md:inline-block">NFT Shark</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/marketplace">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Marketplace
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/betting">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Sports Betting
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] grid-cols-2 gap-3 p-4 md:w-[500px] lg:w-[600px]">
                    <li>
                      <Link to="/collections">
                        <NavigationMenuLink className="hover:bg-accent block space-y-1 rounded-md p-3">
                          <div className="text-sm font-medium">Collections</div>
                          <div className="text-muted-foreground text-xs">
                            Browse popular NFT collections
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/nft/artists">
                        <NavigationMenuLink className="hover:bg-accent block space-y-1 rounded-md p-3">
                          <div className="text-sm font-medium">Artists</div>
                          <div className="text-muted-foreground text-xs">
                            Discover top NFT creators
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link to="/betting/leagues">
                        <NavigationMenuLink className="hover:bg-accent block space-y-1 rounded-md p-3">
                          <div className="text-sm font-medium">Sports Leagues</div>
                          <div className="text-muted-foreground text-xs">
                            Bet on major sports leagues
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/nft/create">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Create
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

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

              <Button variant="outline" size="icon" className="hidden md:flex">
                <Wallet className="h-5 w-5" />
                <span className="sr-only">Wallet</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuItem>
                    <Link to="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/my-nfts" className="w-full">
                      My NFTs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/my-bets" className="w-full">
                      My Bets
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem> */}
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
      </div>
    </header>
  );
}
