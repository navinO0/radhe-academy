import { TableSkeleton } from "@/components/ui/loading-skeletons";

export default function BatchesLoading() {
  return (
    <TableSkeleton
      title={true}
      columns={6}
      rows={6}
      kpiCards={0}
    />
  );
}
