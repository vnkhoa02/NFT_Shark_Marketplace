import { ChevronDown, Wallet } from "lucide-react";
import { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useIsMounted } from "~/hooks/useIsMounted";
import useMarketplace from "~/hooks/useMarketplace";
import { WalletOptions } from "./web3/WalletOptions";

function Connected({ address }: { address: string }) {
  const { disconnect } = useDisconnect();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-input">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
          {address.slice(0, 6)}...{address.slice(-4)}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Etherscan
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500"
          onClick={() => disconnect()}
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { approveNft } = useMarketplace();
  const isMounted = useIsMounted();

  useEffect(() => {
    approveNft(address as `0x${string}`);
  }, [isConnected, address]);

  if (!isMounted) return null;

  if (isConnected) {
    return <Connected address={address as string} />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-900">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>
            Connect your wallet to explore NFT Marketplace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <WalletOptions />
        </div>
      </DialogContent>
    </Dialog>
  );
}
