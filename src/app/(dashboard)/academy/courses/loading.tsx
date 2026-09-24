import { CardsGridSkeleton } from "@/components/ui/loading-skeletons";

export default function CoursesLoading() {
  return <CardsGridSkeleton title={true} count={6} />;
}
