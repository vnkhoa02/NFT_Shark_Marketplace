import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getChainId } from "@wagmi/core";
import { BigNumber, ethers } from "ethers";
import { NFTMP_ADDRESS } from "~/lib/addresses/contract";
import { config } from "~/lib/wagmi/config";

const API_KEY = process.env.ALCHEMY_API_KEY;
const MAINNET_ENDPOINT = `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`;
const SEPOLIA_ENDPOINT = `https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`;

const getProvider = () => {
  const chainId = getChainId(config).toString();
  const RPC = chainId !== "1" ? SEPOLIA_ENDPOINT : MAINNET_ENDPOINT;
  return new ethers.providers.JsonRpcProvider(RPC);
};

// Event signature for ItemListed(address,uint256,address,uint256,string)
const eventSignature = ethers.utils.id(
  "ItemListed(address,uint256,address,uint256,string)",
);

export const APIRoute = createAPIFileRoute("/api/nfts/listed/my")({
  GET: async ({ request }) => {
    try {
      const url = new URL(request.url);
      const nft = url.searchParams.get("nft");
      const tokenId = url.searchParams.get("tokenId");
      const seller = url.searchParams.get("seller");
      const categoryFilter = url.searchParams.get("category");

      // Build dynamic topics array
      const topics: Array<string | null> = [eventSignature];

      topics.push(nft ? ethers.utils.hexZeroPad(ethers.utils.getAddress(nft), 32) : null);
      topics.push(
        tokenId ? ethers.utils.hexZeroPad(ethers.utils.hexValue(tokenId), 32) : null,
      );
      topics.push(
        seller ? ethers.utils.hexZeroPad(ethers.utils.getAddress(seller), 32) : null,
      );

      const provider = getProvider();

      const logs = await provider.getLogs({
        address: NFTMP_ADDRESS,
        topics,
        fromBlock: 0,
        toBlock: "latest",
      });

      const events = logs
        .filter((log) => log.topics[0] === eventSignature)
        .map((log) => {
          try {
            const parsed = ethers.utils.defaultAbiCoder.decode(
              ["address", "uint256", "string"],
              log.data,
            );
            return {
              seller: parsed[0],
              price: ethers.utils.formatUnits(parsed[1], "ether"),
              category: parsed[2],
              tokenId: BigNumber.from(log.topics[2]).toString(), // tokenId is indexed
              nft: ethers.utils.getAddress(ethers.utils.hexDataSlice(log.topics[1], 12)),
            };
          } catch (err) {
            console.warn("Skipping invalid log:", err);
            return null;
          }
        })
        .filter(Boolean);

      const filtered = categoryFilter
        ? events.filter((e) => e?.category === categoryFilter)
        : events;

      return json({ events: filtered });
    } catch (error) {
      console.error("Error fetching logs:", error);
      return json({ message: "Error fetching NFT listings" }, { status: 500 });
    }
  },
});
