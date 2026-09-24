import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Shield, Mail, Phone, MapPin, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy of Radhe Vastraz Academy. Learn how we collect, handle, protect, and process your student and personal data.",
  openGraph: {
    title: "Privacy Policy | Radhe Vastraz Academy",
    description: "Learn how Radhe Vastraz Academy protects your personal and academic information.",
  },
};

export default function PrivacyPolicyPage() {
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
            <Shield className="h-4 w-4" /> Legal & Transparency
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Effective Date & Last Updated: <strong>{lastUpdated}</strong>
          </p>
        </div>

        {/* Content Box */}
        <div className="prose prose-invert max-w-none space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <section className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" /> 1. Introduction
            </h2>
            <p>
              Welcome to <strong>Radhe Vastraz Academy</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
              We are committed to safeguarding the privacy and security of our students, prospective applicants, guardians, and visitors who interact with our academy premises, digital portals, and administrative platforms.
            </p>
            <p className="mt-2">
              This Privacy Policy explains how we collect, use, disclose, and protect personal and academic information when you apply, enroll, attend our classes, make fee payments, or use our digital portal at <code>academy.radhevastraz.in</code>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">2. Information We Collect</h2>
            <p>To provide professional vocational and creative education in fashion design, boutique operations, and embroidery craftsmanship, we collect the following categories of information:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Student Identity Data:</strong> Full name, date of birth, gender, blood group, government-issued photo ID (Aadhaar or equivalent for verification), and passport-size photograph.</li>
              <li><strong>Contact Information:</strong> Residential address, personal email address, primary phone number, and emergency contact / guardian details.</li>
              <li><strong>Academic & Enrollment Details:</strong> Selected course track, batch allocation, batch timing, attendance records, practical portfolio assignments, grades, and completion certificates.</li>
              <li><strong>Financial & Fee Records:</strong> Agreed fee structure, installment plans, payment mode (UPI, card, bank transfer, cash receipt), transaction reference numbers, and billing receipts. <em>Note: We do not store credit card CVVs or net banking credentials.</em></li>
              <li><strong>Technical & Portal Data:</strong> Session cookies, IP addresses, browser types, and system audit logs to safeguard student portals from unauthorized access.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">3. How We Use Your Information</h2>
            <p>We process your data strictly for legitimate educational, administrative, and statutory purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Processing student applications, batch admissions, and issuing unique Student Roll Codes.</li>
              <li>Recording daily biometric or digital attendance and evaluating minimum attendance quotas required for course certification.</li>
              <li>Generating official fee receipts, tracking installment schedules, and sending payment reminder notifications.</li>
              <li>Issuing verified course completion diplomas and skill certificates upon training completion.</li>
              <li>Providing academic updates, class cancellations, holiday notifications, and workshop schedules.</li>
              <li>Complying with applicable educational, taxation (GST), and regulatory reporting requirements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">4. Cookies and Local Storage</h2>
            <p>
              Our academy management application uses essential cookies and local storage tokens to keep you securely signed in to the student and staff portals, remember your theme preferences, and protect against Cross-Site Request Forgery (CSRF).
            </p>
            <p>
              We do not use intrusive third-party cross-site behavioral tracking or sell student personal data to advertisers.
            </p>
          </section>

          <section className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> 5. Data Security and Safeguards
            </h2>
            <p>
              Radhe Vastraz Academy takes the security of student records seriously. We enforce industry-standard technical and organizational security controls:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>HTTPS / TLS encryption for all data in transit across our portal.</li>
              <li>Argon2 / Bcrypt cryptographic hashing for all user passwords.</li>
              <li>Role-based access control (RBAC) ensuring only authorized administrative staff can access student contact records.</li>
              <li>Encrypted database storage with regular offsite automated backups.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">6. Sharing of Information</h2>
            <p>We do not sell, trade, or rent student personal data. We disclose information only to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Authorized Academy Staff & Instructors:</strong> To facilitate daily classroom instruction, machine practicals, and syllabus tracking.</li>
              <li><strong>Payment Service Providers:</strong> Verified banking and UPI gateways processing fee payments.</li>
              <li><strong>Statutory Authorities:</strong> When required by lawful process, court order, or governmental authorities under Indian law.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">7. Student Rights & Retention</h2>
            <p>
              Students and guardians have the right to inspect their academic dossier, request corrections to misspelled contact records, and obtain a copy of their fee receipts.
              Academic graduation and certification records are archived for verification purposes as required by industry accreditation standards.
            </p>
          </section>

          <section className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">8. Contact Our Data Protection Officer</h2>
            <p>For any questions or privacy inquiries regarding your student records, please contact us:</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>privacy@radhevastraz.in</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300 sm:col-span-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Radhe Vastraz Academy, Fashion & Design Studio, Hyderabad, Telangana, India</span>
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
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
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

