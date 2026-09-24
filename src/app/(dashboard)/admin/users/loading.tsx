import { TableSkeleton } from "@/components/ui/loading-skeletons";

export default function UsersLoading() {
  return (
    <TableSkeleton
      title={true}
      columns={5}
      rows={6}
      kpiCards={0}
    />
  );
}
