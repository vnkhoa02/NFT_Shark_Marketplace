import { useState } from "react";
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
import useMyNft from "~/hooks/useMyNft";

interface ListingDialogProps {
  open: boolean;
  onClose: () => void;
  tokenId: string | null;
}

export default function ListingDialog({ open, onClose, tokenId }: ListingDialogProps) {
  const [price, setPrice] = useState("");
  const { listingNft, isListing } = useMarketplace();
  const { fetchNftById } = useMyNft();

  const handleSubmit = async () => {
    if (!tokenId || !price) return;
    if (parseFloat(price) < 0.001) return;
    const ntf = await fetchNftById(tokenId);
    listingNft(ntf.contractAddress, tokenId, price, ntf.category);
    onClose();
  };

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
          <Button onClick={handleSubmit} disabled={!price || isListing}>
            {isListing ? "Listing..." : "List for Sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
