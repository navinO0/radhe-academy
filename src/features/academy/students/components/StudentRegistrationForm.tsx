"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createStudentAction } from "@/features/academy/students/student.actions";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface CourseOption {
  id: string;
  name: string;
  defaultFee: string;
}

interface BatchOption {
  id: string;
  name: string;
  courseId: string;
  capacity: number;
  enrolled: number;
}

interface StudentRegistrationFormProps {
  courses: CourseOption[];
  batches: BatchOption[];
}

export function StudentRegistrationForm({ courses, batches }: StudentRegistrationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Selected course and batch state
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  // Fee state
  const [quotedFee, setQuotedFee] = useState<string>("");
  const [registrationFee, setRegistrationFee] = useState<string>("0");
  const [discountAmount, setDiscountAmount] = useState<string>("0");
  const [discountReason, setDiscountReason] = useState<string>("");

  // Default date
  const today = new Date().toISOString().split("T")[0] || "";

  // Instalments schedule state
  const [instalments, setInstalments] = useState<Array<{ label: string; amount: string; dueDate: string }>>([
    { label: "Registration / 1st Instalment", amount: "", dueDate: today },
  ]);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<string>("FEMALE");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [joiningDate, setJoiningDate] = useState(today);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("");
  const [notes, setNotes] = useState("");

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedBatchId("");
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setQuotedFee(course.defaultFee);
      if (instalments.length === 1) {
        setInstalments([{ label: "Full Course Fee", amount: course.defaultFee, dueDate: joiningDate || today }]);
      }
    }
  };

  const filteredBatches = batches.filter((b) => b.courseId === selectedCourseId);

  const addInstalment = () => {
    setInstalments((prev) => [
      ...prev,
      { label: `${prev.length + 1}th Instalment`, amount: "", dueDate: "" },
    ]);
  };

  const removeInstalment = (index: number) => {
    if (instalments.length <= 1) return;
    setInstalments((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInstalment = (index: number, field: "label" | "amount" | "dueDate", value: string) => {
    setInstalments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const totalPayable = (parseFloat(quotedFee || "0") + parseFloat(registrationFee || "0") - parseFloat(discountAmount || "0")).toFixed(2);
  const instalmentsTotal = instalments.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toFixed(2);

  // Auto-sync single instalment amount with totalPayable when not customized into multiple instalments
  useEffect(() => {
    if (instalments.length === 1 && totalPayable && parseFloat(totalPayable) >= 0) {
      setInstalments((prev) => {
        const first = prev[0];
        if (prev.length === 1 && first && first.amount !== totalPayable) {
          return [{ label: first.label, amount: totalPayable, dueDate: first.dueDate }];
        }
        return prev;
      });
    }
  }, [totalPayable, instalments.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !selectedCourseId) {
      toast.error("Please fill in full name, phone number, and select a course");
      return;
    }

    if (parseFloat(instalmentsTotal) !== parseFloat(totalPayable)) {
      toast.error(`Instalments total (₹${instalmentsTotal}) must match Total Payable (₹${totalPayable})`);
      return;
    }

    startTransition(async () => {
      const payload = {
        fullName,
        phone,
        email: email || undefined,
        gender: gender as any,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        joiningDate: new Date(joiningDate || today),
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        postalCode: postalCode || undefined,
        emergencyContactName: emergencyContactName || undefined,
        emergencyContactPhone: emergencyContactPhone || undefined,
        emergencyContactRelation: emergencyContactRelation || undefined,
        courseId: selectedCourseId,
        batchId: selectedBatchId || undefined,
        notes: notes || undefined,
        quotedFee,
        registrationFee: registrationFee || "0",
        discountAmount: discountAmount || "0",
        discountReason: discountReason || undefined,
        instalments: instalments.map((inst) => ({
          label: inst.label,
          amount: inst.amount,
          dueDate: new Date(inst.dueDate),
        })),
      };

      const res = await createStudentAction(payload);
      if (res.success) {
        toast.success(res.message || "Student registered successfully!");
        router.push("/academy/students");
      } else {
        toast.error(res.error || "Failed to register student");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Personal & Emergency Contact */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1. Personal Information</CardTitle>
              <CardDescription>Basic contact details and identification</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="e.g. Ananya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (10 digits) *</Label>
                <Input
                  id="phone"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ananya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
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
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address / apartment"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Hyderabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="500001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">2. Emergency Contact</CardTitle>
              <CardDescription>Family member or guardian to reach in case of emergencies</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="emName">Contact Name</Label>
                <Input
                  id="emName"
                  placeholder="Parent / Guardian"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emPhone">Emergency Phone</Label>
                <Input
                  id="emPhone"
                  placeholder="9876543210"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emRelation">Relationship</Label>
                <Input
                  id="emRelation"
                  placeholder="Mother / Father"
                  value={emergencyContactRelation}
                  onChange={(e) => setEmergencyContactRelation(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Academy Program & Fees */}
        <div className="space-y-6">
          {/* Course & Batch Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">3. Academy Program</CardTitle>
              <CardDescription>Enrollment course, batch, and joining timeline</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select value={selectedCourseId} onValueChange={handleCourseChange}>
              <SelectTrigger id="course">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} (₹{c.defaultFee})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch">Batch (Optional)</Label>
            <Select
              value={selectedBatchId}
              onValueChange={setSelectedBatchId}
              disabled={!selectedCourseId}
            >
              <SelectTrigger id="batch">
                <SelectValue placeholder={selectedCourseId ? "Select batch" : "Choose course first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredBatches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name} ({b.enrolled}/{b.capacity} seats)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joiningDate">Joining Date *</Label>
            <Input
              id="joiningDate"
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Fee Agreement & Instalments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">4. Fee Agreement & Instalment Plan</CardTitle>
          <CardDescription>Historical financial agreement and scheduled due dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="quotedFee">Quoted Course Fee (₹) *</Label>
              <Input
                id="quotedFee"
                type="number"
                placeholder="30000"
                value={quotedFee}
                onChange={(e) => setQuotedFee(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
              <Input
                id="registrationFee"
                type="number"
                placeholder="0"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountAmount">Discount (₹)</Label>
              <Input
                id="discountAmount"
                type="number"
                placeholder="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPayable">Total Payable (₹)</Label>
              <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm font-semibold text-primary">
                ₹{totalPayable}
              </div>
            </div>
          </div>

          {parseFloat(discountAmount || "0") > 0 && (
            <div className="space-y-2">
              <Label htmlFor="discountReason">Discount Reason</Label>
              <Input
                id="discountReason"
                placeholder="e.g. Early bird scholarship"
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
              />
            </div>
          )}

          {/* Instalment Schedule */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-medium">Instalment Schedule</h4>
                <p className="text-xs text-muted-foreground">
                  Scheduled breakdown (Sum: ₹{instalmentsTotal} / Target: ₹{totalPayable})
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addInstalment} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-1" /> Add Instalment
              </Button>
            </div>

            <div className="space-y-3">
              {instalments.map((inst, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 sm:p-0 rounded-lg sm:rounded-none bg-muted/30 sm:bg-transparent border sm:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs text-muted-foreground sm:hidden mb-1 block">Label</Label>
                    <Input
                      placeholder="Instalment Label"
                      value={inst.label}
                      onChange={(e) => updateInstalment(index, "label", e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-full sm:w-36">
                    <Label className="text-xs text-muted-foreground sm:hidden mb-1 block">Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="Amount (₹)"
                      value={inst.amount}
                      onChange={(e) => updateInstalment(index, "amount", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-48">
                    <div className="flex-1 min-w-0">
                      <Label className="text-xs text-muted-foreground sm:hidden mb-1 block">Due Date</Label>
                      <Input
                        type="date"
                        value={inst.dueDate}
                        onChange={(e) => updateInstalment(index, "dueDate", e.target.value)}
                        required
                      />
                    </div>
                    {instalments.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 shrink-0 mt-auto sm:mt-0"
                        onClick={() => removeInstalment(index)}
                        title="Remove instalment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="notes">Notes / Special Instructions</Label>
            <Textarea
              id="notes"
              placeholder="Any medical condition, batch shift preferences, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push("/academy/students")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering Student...
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </div>
    </form>
  );
}
