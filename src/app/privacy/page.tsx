import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Globe } from "lucide-react";
import { CLOUDINARY_ASSETS } from "@/lib/cloudinary";
import { PrintDocumentButton } from "@/components/common/print-document-button";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Privacy Policy | Student Data Protection & Privacy Notice",
  description:
    "Official Student Privacy Policy and Data Protection Notice of Radhe Vastraz Academy Hyderabad. Learn how student data, attendance, and academic records are securely handled.",
  openGraph: {
    title: "Student Privacy Policy | Radhe Vastraz Academy",
    description:
      "Learn how Radhe Vastraz Academy collects, protects, and handles student identity, academic records, and fee payment details under Indian data protection principles.",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 27, 2026";
  const docRef = "RVA/POL/PRIV-2026/01";

  const sections = [
    { num: "1", title: "Introduction & Scope" },
    { num: "2", title: "Information We Collect" },
    { num: "3", title: "Purpose and Lawful Use" },
    { num: "4", title: "Cookies and Portal Tokens" },
    { num: "5", title: "Data Security and Safeguards" },
    { num: "6", title: "Information Sharing and Disclosure" },
    { num: "7", title: "Student Rights and Record Retention" },
    { num: "8", title: "Grievance Officer and Contact Desk" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f4ef] text-stone-900 py-6 sm:py-10 px-3 sm:px-6 font-sans antialiased selection:bg-stone-200">
      {/* Top Web Action Bar (Hidden when printed) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center text-stone-700 hover:text-stone-950 font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back to Academy Home
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/terms"
            className="text-stone-600 hover:text-stone-950 transition-colors underline underline-offset-4"
          >
            Terms &amp; Conditions
          </Link>
          <a
            href="https://wa.me/919063643342?text=Hello%20Divya%2C%20I%20have%20an%20inquiry%20regarding%20the%20Academy%20Privacy%20Policy."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center text-stone-600 hover:text-stone-950 transition-colors"
          >
            <Phone className="h-3 w-3 mr-1" />
            Helpline: 9063643342
          </a>
          <PrintDocumentButton
            label="Print Document / PDF"
            className="h-8 text-xs bg-white text-stone-800 border-stone-300 hover:bg-stone-100"
          />
        </div>
      </div>

      {/* Printable Paper Document Sheet */}
      <article className="max-w-4xl mx-auto bg-white border border-stone-300 shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 rounded-[2px] p-8 sm:p-12 md:p-16 text-stone-900">
        {/* Official Institutional Letterhead */}
        <header className="border-b-2 border-stone-900 pb-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 rounded border border-stone-300 shrink-0 overflow-hidden bg-white">
                <Image
                  src={CLOUDINARY_ASSETS.logo}
                  alt="Radhe Vastraz Academy Logo"
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 leading-tight">
                  RADHE VASTRAZ ACADEMY
                </h1>
                <p className="text-xs uppercase tracking-wider text-stone-600 font-medium mt-0.5">
                  Boutique Craftsmanship &amp; Fashion Design Institute
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-stone-600 space-y-0.5 font-mono">
              <div>Ref: {docRef}</div>
              <div>Date: {lastUpdated}</div>
              <div>Location: Hyderabad, India</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-600 flex flex-wrap gap-x-5 gap-y-1.5 leading-relaxed">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-stone-500 shrink-0" />
              Shop No. 1, Jal Vayu Vihar, Kukatpally, backside of community office building, Hyderabad 500085
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-stone-500 shrink-0" />
              +91 9063643342 (Divya)
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-stone-500 shrink-0" />
              radhevastraz@gmail.com | raadhelabel@gmail.com
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-stone-500 shrink-0" />
              https://academy.radhevastraz.in
            </span>
          </div>
        </header>

        {/* Document Title Header */}
        <div className="text-center my-8 pb-6 border-b border-stone-200">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 tracking-tight uppercase leading-snug">
            Student Privacy Policy &amp; Data Protection Notice
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl mx-auto">
            Official institutional policy outlining the lawful collection, processing, security controls, record archiving, and protection of personal and academic student information.
          </p>
        </div>

        {/* Minimal Table of Contents */}
        <nav aria-label="Table of Contents" className="my-8 p-4 bg-stone-50 border border-stone-200 rounded-[2px] print:hidden">
          <div className="font-serif font-bold text-xs uppercase tracking-wider text-stone-800 mb-2.5">
            Table of Contents
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1.5 text-xs text-stone-700">
            {sections.map((sec) => (
              <a
                key={sec.num}
                href={`#section-${sec.num}`}
                className="hover:text-stone-950 hover:underline truncate py-0.5"
              >
                <span className="font-semibold text-stone-900 mr-1">{sec.num}.</span>
                {sec.title}
              </a>
            ))}
          </div>
        </nav>

        {/* 8 Document Sections */}
        <div className="space-y-7 text-[15px] text-stone-800 leading-relaxed">
          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-6 pt-2">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              1. Introduction &amp; Scope
            </h3>
            <p className="mb-2">
              Welcome to <strong>Radhe Vastraz Academy</strong> (&ldquo;Academy,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to safeguarding the privacy, confidentiality, and security of our students, prospective applicants, guardians, and visitors who interact with our academy workshops, training premises, and digital portals.
            </p>
            <p>
              This Privacy Policy explains our practices regarding the collection, use, retention, and safeguarding of personal and academic information when you apply, enroll, attend classes, make fee payments, or access our digital student portal at <code>academy.radhevastraz.in</code>.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              2. Information We Collect
            </h3>
            <p className="mb-2">
              To deliver professional vocational education in fashion designing, boutique operations, pattern drafting, and embroidery craftsmanship, we collect the following necessary categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-stone-800">
              <li>
                <strong>Student Identity Data:</strong> Full legal name, date of birth, gender, blood group, government-issued photo ID (Aadhaar or equivalent for official enrollment verification), and passport-size photograph.
              </li>
              <li>
                <strong>Contact Information:</strong> Residential address, personal email address, primary phone number, and emergency contact or guardian details.
              </li>
              <li>
                <strong>Academic &amp; Training Records:</strong> Enrolled course track, assigned batch, batch timings, daily practical attendance logs, portfolio submissions, assessment marks, and completion certificates.
              </li>
              <li>
                <strong>Financial &amp; Fee Records:</strong> Agreed fee structure, installment records, payment transaction identifiers, UPI/bank payment receipts, and billing statements. <em>Note: The Academy does not store debit/credit card CVV codes or net banking passwords.</em>
              </li>
              <li>
                <strong>Portal &amp; System Logs:</strong> Session tokens, IP addresses, browser types, and system audit logs to safeguard student portals from unauthorized access.
              </li>
            </ul>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              3. Purpose and Lawful Use of Student Information
            </h3>
            <p className="mb-2">
              We process personal information strictly for legitimate academic, administrative, and statutory purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-stone-800">
              <li>Processing student admissions, batch allocation, and issuing unique Student Roll Codes.</li>
              <li>Monitoring and recording daily attendance to verify compliance with the mandatory 100% attendance requirement.</li>
              <li>Managing fee invoices, issuing official receipts, and tracking payment installments.</li>
              <li>Evaluating practical assessments, coursework, and certifying course completion.</li>
              <li>Sending important administrative notices, timetable updates, holiday announcements, and workshop schedules.</li>
              <li>Complying with applicable educational, taxation (GST), and statutory accounting regulations.</li>
            </ul>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              4. Cookies and Portal Tokens
            </h3>
            <p className="mb-2">
              Our web applications use strictly necessary cookies and local storage tokens to maintain authenticated student and faculty sessions, protect against Cross-Site Request Forgery (CSRF), and maintain site security.
            </p>
            <p className="text-xs text-stone-600">
              We do not utilize invasive third-party cross-site behavioral tracking cookies, nor do we sell student personal details to third-party marketing firms or advertisers.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              5. Data Security and Safeguards
            </h3>
            <p className="mb-2">
              Radhe Vastraz Academy implements rigorous technical, administrative, and physical security measures to protect student records from unauthorized access, accidental alteration, disclosure, or destruction:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-stone-800">
              <li>HTTPS / TLS 1.3 encryption across all web traffic and portal interactions.</li>
              <li>Cryptographic password hashing (Bcrypt / Argon2) for all student and instructor portal accounts.</li>
              <li>Strict Role-Based Access Controls (RBAC) ensuring only authorized administrative personnel can access student dossiers.</li>
              <li>Encrypted database storage with regular offsite automated backups to prevent data loss.</li>
            </ul>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              6. Information Sharing and Disclosure
            </h3>
            <p className="mb-2">
              We maintain strict confidentiality over student records. Personal information is disclosed only in the following specific circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-stone-800">
              <li>
                <strong>Authorized Instructors &amp; Staff:</strong> To facilitate practical workshop sessions, machine training, and syllabus progress.
              </li>
              <li>
                <strong>Payment &amp; Banking Gateways:</strong> Verified financial gateways to process fee transactions securely.
              </li>
              <li>
                <strong>Statutory &amp; Lawful Authorities:</strong> When required by court order, law enforcement, or statutory authorities under Indian law.
              </li>
            </ul>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              7. Student Rights and Record Retention
            </h3>
            <p className="mb-2">
              Students and authorized guardians have the right to inspect their personal academic files, request corrections of typographical errors, and obtain copies of fee receipts.
            </p>
            <p className="text-xs text-stone-600">
              Certificate registries, verification records, and graduation rosters are archived permanently by the Academy to enable legitimate third-party certificate authentication for employment or verification purposes.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              8. Grievance Officer and Contact Desk
            </h3>
            <p className="mb-3">
              If you have any questions, feedback, or grievance regarding this Privacy Policy or the handling of your student data, please contact our administrative desk:
            </p>
            <div className="border border-stone-300 bg-stone-50 p-4 text-xs sm:text-sm text-stone-800 space-y-2">
              <div>
                <strong>Administrative Officer:</strong> Divya (Radhe Vastraz Academy)
              </div>
              <div>
                <strong>Admissions Helpline:</strong> +91 9063643342
              </div>
              <div>
                <strong>Official Email:</strong> radhevastraz@gmail.com (Support: raadhelabel@gmail.com)
              </div>
              <div>
                <strong>Academy Address:</strong> Shop No. 1, Jal Vayu Vihar, Kukatpally, backside of community office building, Hyderabad, Telangana, India (500085)
              </div>
            </div>
          </section>
        </div>

        {/* Formal Institutional Sign-off Block */}
        <div className="mt-14 pt-8 border-t-2 border-stone-900 break-inside-avoid">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs text-stone-800">
            <div>
              <div className="font-serif font-bold uppercase tracking-wider text-stone-950 mb-1">
                Issued by Authority
              </div>
              <div>Radhe Vastraz Academy Administrative Office</div>
              <div>Hyderabad, Telangana, India</div>
            </div>

            <div className="text-left sm:text-right">
              <div className="font-mono text-stone-600 text-[11px] mb-1">
                Document Code: {docRef}
              </div>
              <div className="h-12 border border-dashed border-stone-400 px-6 flex items-center justify-center text-stone-400 uppercase text-[10px] tracking-widest">
                [ Official Academy Seal ]
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Page Footer (Web Only) */}
      <footer className="max-w-4xl mx-auto mt-8 text-center text-xs text-stone-500 print:hidden space-y-2">
        <p>© {new Date().getFullYear()} Radhe Vastraz Academy. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 text-stone-600">
          <Link href="/terms" className="hover:text-stone-900 underline underline-offset-4">
            Terms &amp; Conditions
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-stone-900 underline underline-offset-4">
            Academy Home
          </Link>
          <span>•</span>
          <Link href="/login" className="hover:text-stone-900 underline underline-offset-4">
            Portal Login
          </Link>
        </div>
      </footer>
    </div>
  );
}
