import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import useMarketplace from "~/hooks/useMarketplace";
import { getTxStatus } from "~/lib/wagmi/utils";
import { NFT } from "~/types/nft";

interface ListingDialogProps {
  nfts: NFT[];
  open: boolean;
  onClose: () => void;
  tokenId: string | null;
}

export default function ListingDialog({
  nfts,
  open,
  onClose,
  tokenId,
}: ListingDialogProps) {
  const [price, setPrice] = useState("");
  const { listingNft, waitForReceipt, setWaitForReceipt, listHash, isListing } =
    useMarketplace();

  const handleSubmit = async () => {
    if (!tokenId || !price) return;
    if (parseFloat(price) < 0.001) return;
    const ntf = nfts.find((l) => l.id === tokenId);
    if (!ntf) return;
    listingNft(ntf.contractAddress, tokenId, price, ntf.category);
    onClose();
  };

  useEffect(() => {
    if (!listHash) return;
    toast.info("Track your Transaction!", {
      description: (
        <a
          href={`https://sepolia.etherscan.io/tx/${listHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline"
        >
          View on Etherscan
        </a>
      ),
    });
    setWaitForReceipt(true);
    getTxStatus(listHash)
      .then((status) => {
        if (status === "success") {
          toast.success("NFT Listed! 🎉");
        } else {
          toast.error("NFT List failed 😢");
        }
      })
      .finally(() => setWaitForReceipt(false));
  }, [listHash, setWaitForReceipt]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List NFT for Sale</DialogTitle>
          <DialogDescription>Set a price for your NFT.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Price (ETH)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              step="0.001"
              min="0.001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!price || isListing || waitForReceipt}>
            {isListing || waitForReceipt ? "Listing..." : "List for Sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
