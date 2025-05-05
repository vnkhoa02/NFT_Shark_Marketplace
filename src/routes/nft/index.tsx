import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/nft/")({
  component: NtfPage,
});

function NtfPage() {
  return <div></div>;
}
