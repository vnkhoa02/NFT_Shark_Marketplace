import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/betting/")({
  component: Betting,
});

function Betting() {
  return <div></div>;
}
