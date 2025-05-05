import { formatEther } from "viem";

export function parseEtherToReadable(amount: unknown): string {
  try {
    if (!amount) return "0";
    const result = formatEther(amount as bigint);
    return parseFloat(result).toFixed(5);
  } catch (err) {
    console.error("Invalid ether amount:", err);
    return "0";
  }
}
