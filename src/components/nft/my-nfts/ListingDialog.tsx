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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useMarketplace from "~/hooks/useMarketplace";
import { SHARK_721_ADDRESS } from "~/lib/addresses/contract";

interface ListingDialogProps {
  open: boolean;
  onClose: () => void;
  tokenId: string | null;
}

export default function ListingDialog({ open, onClose, tokenId }: ListingDialogProps) {
  const [price, setPrice] = useState("");
  const { listingNft, isListing } = useMarketplace();

  const handleSubmit = () => {
    if (!tokenId || !price) return;
    listingNft(SHARK_721_ADDRESS, tokenId, price);
    setPrice("");
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
              min="0.001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Duration</Label>
            <Select defaultValue="30-days">
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-day">1 day</SelectItem>
                <SelectItem value="3-days">3 days</SelectItem>
                <SelectItem value="7-days">7 days</SelectItem>
                <SelectItem value="30-days">30 days</SelectItem>
                <SelectItem value="90-days">90 days</SelectItem>
                <SelectItem value="99999999-days">Forever</SelectItem>
              </SelectContent>
            </Select>
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
