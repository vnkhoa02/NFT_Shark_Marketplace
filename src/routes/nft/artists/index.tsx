import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/nft/artists/")({
  component: NtfArtists,
});

function NtfArtists() {
  return <div></div>;
}
