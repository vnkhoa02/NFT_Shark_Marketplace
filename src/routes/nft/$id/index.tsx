import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/nft/$id/")({
  component: NtfDetail,
});

function NtfDetail() {
  return <div></div>;
}
