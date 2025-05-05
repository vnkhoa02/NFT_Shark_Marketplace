import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/betting/leagues/")({
  component: BettingLeagues,
});

function BettingLeagues() {
  return <div></div>;
}
