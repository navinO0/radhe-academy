import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Scale, AlertTriangle, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions governing enrollment, courses, studio safety, fee payments, and certifications at Radhe Vastraz Academy.",
  openGraph: {
    title: "Terms and Conditions | Radhe Vastraz Academy",
    description: "Read the academic policies, fee schedules, studio guidelines, and certification rules of Radhe Vastraz Academy.",
  },
};

export default function TermsPage() {
  const lastUpdated = "September 24, 2026";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight block">Radhe Vastraz</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block -mt-1 font-medium">Academy</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800 text-slate-200">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-primary text-sm font-semibold tracking-wide uppercase mb-2">
            <Scale className="h-4 w-4" /> Academic & Enrollment Rules
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Effective Date & Last Updated: <strong>{lastUpdated}</strong>
          </p>
        </div>

        {/* Content Box */}
        <div className="prose prose-invert max-w-none space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <section className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-primary" /> 1. Acceptance of Terms
            </h2>
            <p>
              By registering for any course, submitting an admission application, paying enrollment fees, or accessing the student/staff portal of <strong>Radhe Vastraz Academy</strong> (&ldquo;Academy&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), you (&ldquo;Student&rdquo;, &ldquo;Parent/Guardian&rdquo;) agree to be legally bound by these Terms and Conditions.
            </p>
            <p className="mt-2">
              If you are under 18 years of age, a parent or legal guardian must review and consent to these terms on your behalf during the registration process.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">2. Admissions & Course Enrolment</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Seat Allocation:</strong> Admission to any specific batch (Morning, Afternoon, Evening, or Weekend) is subject to seat availability in our practical atelier stations.</li>
              <li><strong>Prerequisites:</strong> Students must possess reasonable dedication and fulfill basic aptitude requirements for drafting, garment cutting, and machine stitching.</li>
              <li><strong>Verification:</strong> The Academy reserves the right to cancel admission if false identification or fraudulent documents are provided.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">3. Attendance & Certification Policy</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Mandatory Attendance:</strong> To qualify for the official Radhe Vastraz Academy Course Diploma / Certificate of Completion, a minimum of <strong>85% attendance</strong> is mandatory across all scheduled theory and practical sessions.</li>
              <li><strong>Leave of Absence:</strong> Prior written notice or guardian intimation must be submitted to the Academy desk for any planned leave exceeding 2 consecutive days.</li>
              <li><strong>Assessment & Portfolio:</strong> Certificates are awarded only upon satisfactory completion and submission of designated practical projects, pattern drafts, and final stitched garments.</li>
            </ul>
          </section>

          <section className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">4. Fee Schedule & Payment Obligations</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Fee Structure:</strong> Course fees must be paid in accordance with the official fee schedule agreed upon during admission (full advance or sanctioned monthly installment plans).</li>
              <li><strong>Installment Deadlines:</strong> Installments are due on or before the 5th of each calendar month. A late payment administrative fee may apply after a 5-day grace period.</li>
              <li><strong>Non-Payment:</strong> Failure to pay dues after reminders may result in temporary suspension of classroom access and withholding of completion certificates.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">5. Refund & Cancellation Policy</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Registration / Booking Deposit:</strong> Seat reservation fees are non-refundable as workstations and materials are reserved specifically for you.</li>
              <li><strong>Withdrawal before Course Start:</strong> If written withdrawal is requested at least 7 calendar days prior to batch commencement, 70% of tuition fees (excluding registration fee) will be refunded.</li>
              <li><strong>Withdrawal after Course Start:</strong> Once the batch commences, no fee refunds, adjustments, or transfers to third parties will be permitted under any circumstances.</li>
            </ul>
          </section>

          <section className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" /> 6. Studio Equipment & Workplace Safety
            </h2>
            <p>
              Students work with specialized industrial sewing machinery, rotary cutters, sharp tailoring shears, high-temperature steam irons, and embroidery apparatus.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Students must strictly adhere to instructor safety guidelines at all times.</li>
              <li>Negligent handling or intentional damage to machinery, dress forms, or academy property will result in replacement costs charged to the student.</li>
              <li>Radhe Vastraz Academy shall not be liable for minor personal accidents resulting from student negligence or failure to wear appropriate studio attire.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">7. Intellectual Property & Student Work</h2>
            <p>
              Course materials, pattern masters, handouts, syllabus guides, and training videos provided by Radhe Vastraz Academy are proprietary. Commercial reproduction, unauthorized distribution, or online upload is strictly prohibited.
            </p>
            <p>
              Students retain ownership of their personal garment creations and portfolio pieces. However, the Academy reserves the right to photograph student work, fashion showcases, and classroom sessions for academic records, annual exhibitions, and marketing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">8. Code of Conduct & Termination</h2>
            <p>
              The Academy upholds an inclusive, professional, and respectful creative environment. Harassment, discrimination, theft, or disruptive behavior will lead to immediate expulsion without fee refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">9. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and Conditions are governed by the laws of India. Any legal dispute or claims arising out of or related to our services shall be subject to the exclusive jurisdiction of the competent courts in <strong>Hyderabad / Telangana, India</strong>.
            </p>
          </section>

          <section className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">10. Contact Administration</h2>
            <p>For inquiries regarding course terms, batch changes, or fee receipts, please contact:</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>administration@radhevastraz.in</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300 sm:col-span-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Radhe Vastraz Academy, Fashion Studio & Boutique Training Center, Hyderabad, India</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Radhe Vastraz Academy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/thank-you" className="hover:text-slate-300 transition-colors">
              Thank You
            </Link>
            <Link href="/academy/courses" className="hover:text-slate-300 transition-colors">
              Courses
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

