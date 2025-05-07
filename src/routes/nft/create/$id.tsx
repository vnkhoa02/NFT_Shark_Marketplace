import { createFileRoute } from "@tanstack/react-router";
import CreateNtf from "~/components/nft/create/CreateNft";

export const Route = createFileRoute("/nft/create/$id")({
  component: CreateNtf,
});
