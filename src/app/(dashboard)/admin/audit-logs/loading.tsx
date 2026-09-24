import { TableSkeleton } from "@/components/ui/loading-skeletons";

export default function AuditLogsLoading() {
  return (
    <TableSkeleton
      title={true}
      columns={5}
      rows={10}
      kpiCards={0}
    />
  );
}

