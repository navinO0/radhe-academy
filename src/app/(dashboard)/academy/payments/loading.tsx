import { TableSkeleton } from "@/components/ui/loading-skeletons";

export default function PaymentsLoading() {
  return (
    <TableSkeleton
      title={true}
      columns={6}
      rows={8}
      kpiCards={4}
    />
  );
}
