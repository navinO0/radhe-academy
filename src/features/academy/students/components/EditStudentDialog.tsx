"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Loader2, User, Phone, MapPin, ShieldAlert, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { updateStudentAction } from "../student.actions";

interface EditStudentDialogProps {
  student: {
    id: string;
    publicId: string;
    studentCode: string;
    fullName: string;
    phone: string;
    email: string | null;
    gender: string | null;
    dateOfBirth?: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    emergencyContactRelation: string | null;
    batchId?: string | null;
    status: string;
    notes: string | null;
  };
  batches: Array<{ id: string; name: string }>;
  trigger?: React.ReactNode;
}

export function EditStudentDialog({
  student,
  batches,
  trigger,
}: EditStudentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(student.fullName);
  const [phone, setPhone] = useState(student.phone);
  const [email, setEmail] = useState(student.email || "");
  const [gender, setGender] = useState(student.gender || "FEMALE");
  const [dateOfBirth, setDateOfBirth] = useState(student.dateOfBirth || "");
  const [address, setAddress] = useState(student.address || "");
  const [city, setCity] = useState(student.city || "");
  const [state, setState] = useState(student.state || "");
  const [postalCode, setPostalCode] = useState(student.postalCode || "");
  const [emergencyContactName, setEmergencyContactName] = useState(student.emergencyContactName || "");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(student.emergencyContactPhone || "");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(student.emergencyContactRelation || "");
  const [batchId, setBatchId] = useState(student.batchId || "none");
  const [status, setStatus] = useState<any>(student.status);
  const [notes, setNotes] = useState(student.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      toast.error("Full name and phone number are required");
      return;
    }

    startTransition(async () => {
      const res = await updateStudentAction(student.publicId, {
        fullName,
        phone,
        email: email || undefined,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        postalCode: postalCode || undefined,
        emergencyContactName: emergencyContactName || undefined,
        emergencyContactPhone: emergencyContactPhone || undefined,
        emergencyContactRelation: emergencyContactRelation || undefined,
        batchId: batchId && batchId !== "none" ? batchId : null,
        status,
        notes: notes || undefined,
      });

      if (res.success) {
        toast.success("Student profile updated successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update student profile");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Edit Student Profile
          </DialogTitle>
          <DialogDescription>
            Modify student identification, contact info, batch allocation, and status for {student.studentCode}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Section 1: Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-fullName">Full Name *</Label>
                <Input
                  id="edit-fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number (10 digits) *</Label>
                <Input
                  id="edit-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="edit-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                    <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dob">Date of Birth</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Address & Location
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-address">Street Address</Label>
                <Input
                  id="edit-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-postalCode">Postal Code</Label>
                <Input
                  id="edit-postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Emergency Contact */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Emergency Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-emName">Contact Name</Label>
                <Input
                  id="edit-emName"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-emPhone">Emergency Phone</Label>
                <Input
                  id="edit-emPhone"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-emRel">Relationship</Label>
                <Input
                  id="edit-emRel"
                  value={emergencyContactRelation}
                  onChange={(e) => setEmergencyContactRelation(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Academic Status & Batch */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" /> Academic Enrollment & Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Student Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="DROPPED">Dropped</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-batch">Assigned Batch</Label>
                <Select value={batchId} onValueChange={setBatchId}>
                  <SelectTrigger id="edit-batch">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None / Unassigned</SelectItem>
                    {batches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="edit-notes">Notes & Remarks</Label>
              <Textarea
                id="edit-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special accommodations, scheduling remarks..."
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t gap-2 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
