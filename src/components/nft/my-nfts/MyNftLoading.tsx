import { Skeleton } from "~/components/ui/skeleton";

export default function MyNftLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Skeleton className="mb-2 h-10 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <Skeleton className="mb-8 h-10 w-full" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="h-[300px] w-full" />
              <div className="p-4">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-4 h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
