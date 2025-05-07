import { createFileRoute } from "@tanstack/react-router";
import CreateNtf from "~/components/nft/create/CreateNft";
import { SHARK_721_ADDRESS } from "~/lib/addresses/contract";

export const Route = createFileRoute("/nft/create/")({
  component: () => <CreateNtf contractAddress={SHARK_721_ADDRESS} />,
});
