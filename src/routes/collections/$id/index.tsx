import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/collections/$id/")({
  component: CollectionDetail,
});

function CollectionDetail() {
  return <div></div>;
}
