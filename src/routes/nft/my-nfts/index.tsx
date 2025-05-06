import { createFileRoute } from "@tanstack/react-router";
import MyNFTs from "~/components/nft/my-nfts/MyNfts";

export const Route = createFileRoute("/nft/my-nfts/")({
  component: MyNFTs,
});
