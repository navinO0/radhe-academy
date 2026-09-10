"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createCourseAction } from "@/features/academy/courses/course.actions";

export default function NewCoursePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("6 months");
  const [defaultFee, setDefaultFee] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !defaultFee) {
      toast.error("Please enter course name and default fee");
      return;
    }

    startTransition(async () => {
      const res = await createCourseAction({
        name,
        description: description || undefined,
        duration: duration || undefined,
        defaultFee,
        status: "ACTIVE",
      });

      if (res.success) {
        toast.success("Course created successfully!");
        router.push("/academy/courses");
      } else {
        toast.error(res.error || "Failed to create course");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-3xl">
      <PageHeader title="New Course" description="Create a new educational course program">
        <Link href="/academy/courses">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course Details</CardTitle>
          <CardDescription>Program information and base pricing structure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cName">Course Name *</Label>
              <Input
                id="cName"
                placeholder="e.g. Master Fashion Illustration"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cDesc">Description</Label>
              <Textarea
                id="cDesc"
                placeholder="Comprehensive course outline and objectives"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cDuration">Duration</Label>
                <Input
                  id="cDuration"
                  placeholder="e.g. 6 months / 24 weeks"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cFee">Default Fee (₹) *</Label>
                <Input
                  id="cFee"
                  type="number"
                  placeholder="30000"
                  value={defaultFee}
                  onChange={(e) => setDefaultFee(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push("/academy/courses")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

