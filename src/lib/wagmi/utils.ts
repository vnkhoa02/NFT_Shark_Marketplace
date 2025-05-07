import { waitForTransactionReceipt } from "@wagmi/core";
import { formatEther } from "viem";
import { config } from "~/lib/wagmi/config";

export function parseEtherToReadable(amount: unknown): string {
  try {
    if (!amount) return "0";
    const result = formatEther(amount as bigint);
    return parseFloat(result).toFixed(3);
  } catch (err) {
    console.error("Invalid ether amount:", err);
    return "0";
  }
}
export const getTxStatus = async (hash: `0x${string}`, confirmations = 1) => {
  if (!hash) return;
  const receipt = await waitForTransactionReceipt(config, {
    confirmations,
    hash,
  });
  return receipt.status;
};
