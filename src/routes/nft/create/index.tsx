import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/nft/create/")({
  component: CreateNtf,
});

function CreateNtf() {
  return <div></div>;
}
