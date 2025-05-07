import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import useMarketplace from "~/hooks/useMarketplace";
import { getTxStatus } from "~/lib/wagmi/utils";
import { NFT } from "~/types/nft";

interface CancelListingDialogProps {
  nfts: NFT[];
  open: boolean;
  onClose: () => void;
  tokenId: string | null;
}

export default function CancelListingDialog({
  nfts,
  open,
  onClose,
  tokenId,
}: CancelListingDialogProps) {
  const { cancelListing, waitForReceipt, setWaitForReceipt, cancelHash, isCancelling } =
    useMarketplace();

  const handleSubmit = async () => {
    const ntf = nfts.find((l) => l.id === tokenId);
    if (!ntf) return;
    cancelListing(ntf.contractAddress, ntf.id);
  };

  useEffect(() => {
    if (!cancelHash) return;
    toast.info("Track your Transaction!", {
      description: (
        <a
          href={`https://sepolia.etherscan.io/tx/${cancelHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline"
        >
          View on Etherscan
        </a>
      ),
    });
    setWaitForReceipt(true);
    getTxStatus(cancelHash)
      .then((status) => {
        if (status === "success") {
          toast.success("NFT Unlisted! 🎉");
        } else {
          toast.error("NFT Unlist failed 😢");
        }
      })
      .finally(() => {
        setWaitForReceipt(false);
        onClose();
      });
  }, [cancelHash, onClose, setWaitForReceipt]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>UnList This NFT From Marketplace</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isCancelling || waitForReceipt}>
            {isCancelling || waitForReceipt ? "Unlisting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
