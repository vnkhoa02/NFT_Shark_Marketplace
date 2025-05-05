import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/marketplace/")({
  component: Marketplace,
});

function Marketplace() {
  return <div></div>;
}
