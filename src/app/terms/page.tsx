import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ArrowLeft,
  Scale,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  FileCheck2,
  Award,
  AlertTriangle,
  HelpCircle,
  FileText,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms and Conditions | Certificate Issuance & Academic Policies",
  description:
    "Official Certificate Issuance, Assessment, Practical Training & Student Certification Terms at Radhe Vastraz Boutique & Fashion Academy.",
  openGraph: {
    title: "Certificate Issuance & Academic Terms | Radhe Vastraz Academy",
    description:
      "Comprehensive academic policies, practical assessment benchmarks, attendance rules, and certificate issuance terms at Radhe Vastraz Academy Hyderabad.",
  },
};

export default function TermsPage() {
  const lastUpdated = "September 27, 2026";

  const categories = [
    { id: "part-1", title: "1. Enrollment & Attendance Mandate", icon: BookOpen },
    { id: "part-2", title: "2. Practical Training & Portfolio", icon: FileCheck2 },
    { id: "part-3", title: "3. Assessment & Academic Integrity", icon: Award },
    { id: "part-4", title: "4. Student Conduct & Financial Clearance", icon: Scale },
    { id: "part-5", title: "5. Certificate Issuance & Duplicates", icon: FileText },
    { id: "part-6", title: "6. Institutional Recognition & Disclaimers", icon: AlertTriangle },
    { id: "part-7", title: "7. Appeals, Governance & Jurisdiction", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-rose-950 selection:text-rose-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-white group">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-[#D4AF37] shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/images/radhe-vastraz-logo.png"
                alt="Radhe Vastraz Boutique & Academy"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-bold text-base tracking-wide block font-serif">RADHE VASTRAZ</span>
              <span className="text-[10px] uppercase tracking-widest text-[#E6C875] block -mt-0.5 font-medium">
                Boutique &amp; Fashion Academy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919063643342?text=Hello%20Divya%2C%20I%20have%20a%20question%20regarding%20the%20Academy%20Terms%20and%20Certification%20policy."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="border-emerald-600/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 text-xs gap-1.5 hidden sm:inline-flex">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>Help: 9063643342</span>
              </Button>
            </a>
            <Link href="/login">
              <Button size="sm" className="bg-[#6B1127] hover:bg-[#801431] text-white font-bold text-xs h-9 px-4 rounded-lg">
                Portal Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Back Link & Title */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Academy Home
          </Link>
          <div className="flex items-center gap-2 text-[#E6C875] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
            <Scale className="h-4 w-4" /> Official Certification &amp; Academic Governance
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-serif">
            Certificate Issuance, Assessment &amp; Student Certification Terms
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-3">
            Official Academic Regulatory Framework • Last Updated: <strong>{lastUpdated}</strong>
          </p>

          {/* Institutional Credentials Banner */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1 sm:space-y-0 sm:flex sm:items-center sm:justify-between flex-wrap gap-3">
            <div>
              <span className="font-bold text-white block sm:inline">Radhe Vastraz Boutique &amp; Fashion Academy</span>
              <span className="hidden sm:inline"> • </span>
              <span>Shop No. 1, Jal Vayu Vihar, Kukatpally, Hyderabad (500085)</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 flex-wrap">
              <span>Helpline: <strong className="text-white">+91 9063643342 (Divya)</strong></span>
              <span>•</span>
              <a href="mailto:radhevastraz@gmail.com" className="text-slate-300 hover:underline">
                radhevastraz@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Quick Category Navigator */}
        <div className="mb-12 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-[#E6C875] mb-3">
            Quick Navigation: Policy Modules
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors border border-slate-800/60"
                >
                  <Icon className="h-3.5 w-3.5 text-[#E6C875] shrink-0" />
                  <span className="truncate">{cat.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Segregated Terms Sections */}
        <div className="space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed">
          {/* ============================================================ */}
          {/* CATEGORY 1: ENROLLMENT & ATTENDANCE MANDATE */}
          {/* ============================================================ */}
          <section id="part-1" className="space-y-6 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <BookOpen className="h-5 w-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-wide">
                Part 1: Course Completion &amp; Attendance Requirements
              </h2>
            </div>

            {/* 1. Purpose of Certification */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                1. Purpose of Certification
              </h3>
              <p>
                The certificate issued by Radhe Vastraz Academy is intended to formally acknowledge that a student has fulfilled the Academy&apos;s prescribed training, minimum attendance, practical atelier learning, and assessment requirements for the enrolled vocational course.
              </p>
              <p>
                The certificate shall be issued <strong>only upon satisfactory completion</strong> of all pedagogical and practical requirements applicable to the relevant course track.
              </p>
            </div>

            {/* 2. Course Completion Requirement */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                2. Course Completion Requirement
              </h3>
              <p>
                Students are required to complete the full scheduled course duration, curriculum modules, drafting lessons, practical atelier sessions, and all other mandatory components prescribed for their enrolled program.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <strong>Important Notice:</strong> Mere completion of the scheduled calendar course duration or attendance hours does not automatically entitle a student to receive a completion certificate. Practical proficiency and assessment clearance are mandatory prerequisites.
              </p>
            </div>

            {/* 3. Attendance Requirement */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                3. Attendance Requirement
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Mandatory Attendance Benchmark:</strong> Students must maintain a minimum attendance of <strong>85% to 100%</strong> across all scheduled practical and theory sessions as prescribed in their course enrollment documents to qualify for certificate eligibility.
                </li>
                <li>
                  <strong>Session Discipline:</strong> Unexcused absences, repeated tardiness, leaving practical stitching or painting sessions early, or failure to actively participate in mandatory demonstrations directly impairs certificate eligibility.
                </li>
                <li>
                  <strong>Make-Up &amp; Replacement Classes:</strong> Where make-up or replacement sessions are permitted due to genuine emergencies, they shall remain strictly subject to instructor scheduling and studio workstation availability, and may be subject to administrative make-up terms where applicable.
                </li>
              </ul>
            </div>
          </section>

          {/* ============================================================ */}
          {/* CATEGORY 2: PRACTICAL TRAINING & PORTFOLIO STANDARDS */}
          {/* ============================================================ */}
          <section id="part-2" className="space-y-6 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <FileCheck2 className="h-5 w-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-wide">
                Part 2: Practical Training, Projects &amp; Portfolio Submissions
              </h2>
            </div>

            {/* 4. Practical Training Requirement */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                4. Practical Atelier Training Requirements
              </h3>
              <p>
                Students must actively participate in all mandatory practical atelier sessions and demonstrate hands-on mastery of practical tailoring, design, and painting competencies covered in the curriculum.
              </p>
              <p className="font-semibold text-white text-xs sm:text-sm">
                For Boutique Tailoring, Fashion Designing, and Fabric Painting courses, mandatory practical competencies include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pt-1">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">• Garment construction &amp; precision stitching</div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">• Pattern making, drafting &amp; fabric cutting</div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">• Body measurements, ease &amp; bespoke fitting</div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">• Fabric handling, grain alignment &amp; selection</div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">• Machine embroidery, aari/maggam &amp; handwork</div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">• Couture seam finishes, piping &amp; press standards</div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">• Traditional Kalamkari, Pichwai &amp; Fabric Art</div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">• Industrial sewing machine operation &amp; safety</div>
              </div>
            </div>

            {/* 5. Assignments, Projects and Portfolio Work */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                5. Mandatory Coursework, Garment Samples &amp; Portfolio Submissions
              </h3>
              <p>
                Where applicable to the enrolled track, students must complete and submit all required drafting records, garment prototypes, practical sample notebooks, fabric painting collections, and client portfolio work prescribed by the Academy faculty.
              </p>
              <p className="text-amber-300/90 text-xs sm:text-sm">
                Failure to submit mandatory coursework, garment samples, or practical records within the prescribed timeline shall render the student ineligible for certification.
              </p>
            </div>
          </section>

          {/* ============================================================ */}
          {/* CATEGORY 3: ASSESSMENT, EVALUATION & ACADEMIC INTEGRITY */}
          {/* ============================================================ */}
          <section id="part-3" className="space-y-6 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <Award className="h-5 w-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-wide">
                Part 3: Assessment, Grading Standards &amp; Academic Integrity
              </h2>
            </div>

            {/* 6. Assessment and Examination */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                6. Assessment &amp; Examination Framework
              </h3>
              <p>
                Students must complete all mandatory assessments prescribed for their course. Evaluation is structured across multiple practical and conceptual parameters:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Continuous Practical Evaluation:</strong> Daily studio stitching, pattern drafting, and machine speed.</li>
                <li><strong>Internal Milestone Reviews:</strong> Periodic blouse, dress, or artwork evaluations.</li>
                <li><strong>Practical Examination:</strong> Timed cutting, stitching, and finishing of assigned design briefs.</li>
                <li><strong>Portfolio &amp; Sample Inspection:</strong> Thorough review of completed garments and surface artwork.</li>
                <li><strong>Oral Viva / Presentation:</strong> Demonstrating technical understanding of fabric estimation, client consultation, and drafting mechanics.</li>
              </ul>
            </div>

            {/* 7 & 8. Passing Requirement & Failure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white">7. Minimum Passing Standard</h3>
                <p className="text-xs sm:text-sm">
                  Students must achieve the minimum competency benchmarks prescribed by senior faculty. A student who finishes the scheduled training calendar but fails to demonstrate the required practical craftsmanship standards will not be automatically certified.
                </p>
              </div>

              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white">8. Failure in Final Assessment</h3>
                <p className="text-xs sm:text-sm">
                  A certificate will not be issued if a student fails to meet the minimum standards of the final practical exam. Fee payment or class presence alone does not guarantee or substitute for practical vocational competence.
                </p>
              </div>
            </div>

            {/* 10. Academic Integrity and Authentic Work */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                9. Academic Integrity &amp; Authentic Workmanship
              </h3>
              <p>
                Students must execute and complete all garments, pattern drafts, embroidery motifs, and fabric artworks honestly and independently, unless cooperative group studio work is explicitly authorized by the instructor.
              </p>
              <p className="text-xs sm:text-sm text-rose-300/90">
                Submitting garments constructed substantially by third-party commercial tailors, copying another student&apos;s project, submitting falsified attendance/assessment logs, or providing fraudulent personal information will result in immediate disqualification and revocation of certification eligibility.
              </p>
            </div>
          </section>

          {/* ============================================================ */}
          {/* CATEGORY 4: STUDENT CONDUCT, DISCIPLINE & ADMINISTRATIVE CLEARANCES */}
          {/* ============================================================ */}
          <section id="part-4" className="space-y-6 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <Scale className="h-5 w-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-wide">
                Part 4: Student Conduct, Studio Safety &amp; Financial Clearances
              </h2>
            </div>

            {/* 11. Student Conduct */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                10. Student Code of Conduct &amp; Studio Safety Rules
              </h3>
              <p>
                Students are expected to maintain professional, supportive, and respectful conduct towards trainers, administrators, atelier technicians, and fellow students at all times.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Compliance with all industrial sewing machine safety rules, rotary cutter guidelines, and steam equipment handling is mandatory.</li>
                <li>Harassment, abusive behavior, discrimination, intentional damage to academy machinery or dress forms, and safety protocol violations will result in immediate disciplinary suspension or expulsion.</li>
                <li>Replacement or repair costs for machinery damaged through willful negligence will be charged to the student.</li>
              </ul>
            </div>

            {/* 12. Course Fees and Administrative Requirements */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                11. Course Fees &amp; Administrative Dues Clearance
              </h3>
              <p>
                All tuition fees, admission charges, and administrative balances must be fully settled in accordance with the student&apos;s agreed payment schedule prior to the release of the final Course Certificate.
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Academic evaluation and grading decisions remain purely competency-based, but official physical and digital certificate release is strictly contingent upon full administrative financial clearance.
              </p>
            </div>
          </section>

          {/* ============================================================ */}
          {/* CATEGORY 5: CERTIFICATE ISSUANCE, CREDENTIALS & DUPLICATES */}
          {/* ============================================================ */}
          <section id="part-5" className="space-y-6 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <FileText className="h-5 w-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-wide">
                Part 5: Certificate Issuance, Verification &amp; Replacements
              </h2>
            </div>

            {/* 13 & 14. Details & Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white">12. Accurate Registration Details</h3>
                <p className="text-xs sm:text-sm">
                  Certificates are generated using the official student records submitted during enrollment (Full Legal Name, Date of Birth, Program Name). Students must verify their credentials prior to graduation. Corrections requested post-printing are subject to verification and re-issuance processing.
                </p>
              </div>

              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white">13. Certificate Format &amp; Modes</h3>
                <p className="text-xs sm:text-sm">
                  The Academy issues certificates in official high-security physical format, digital verifiable PDF format, or both. Each certificate includes an authorized signature, institutional seal, unique serial identification code, and course completion date.
                </p>
              </div>
            </div>

            {/* 15 & 16. Duplicates & Revocation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white">14. Duplicate &amp; Replacement Copies</h3>
                <p className="text-xs sm:text-sm">
                  Duplicate certificates may be re-issued in cases of accidental loss, water damage, or theft upon submission of a formal request, identity verification, and nominal administrative re-printing fees.
                </p>
              </div>

              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white text-rose-300">15. Withholding &amp; Revocation</h3>
                <p className="text-xs sm:text-sm">
                  The Academy reserves the absolute right to withhold, cancel, or permanently revoke any certificate if it is established that the credential was secured through impersonation, academic fraud, forged attendance logs, or false identity records.
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* CATEGORY 6: INSTITUTIONAL RECOGNITION & DISCLAIMERS */}
          {/* ============================================================ */}
          <section id="part-6" className="space-y-6 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-wide">
                Part 6: Legal Recognition, Disclaimers &amp; Verification Register
              </h2>
            </div>

            {/* 17. Certificate Recognition and Status */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                16. Institutional Recognition &amp; Skill Certification Status
              </h3>
              <p>
                Unless expressly stated otherwise in writing, certificates awarded by the Academy are <strong>Academy-Issued Vocational Skill Completion Credentials</strong> acknowledging professional competency in tailoring, fashion design, or artisan fabric painting.
              </p>
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1">
                <p>
                  <strong>Statutory Clarity:</strong> Certificates must not be represented as a statutory government license, formal university degree, UGC/AICTE degree, or certification by NSDC/NCVET unless the Academy is formally affiliated or partnered with that specific awarding body for the respective enrolled program.
                </p>
                <p className="text-slate-400">
                  Students and alumni agree never to make false, misleading, or deceptive representations regarding the institutional accreditation of the certificate.
                </p>
              </div>
            </div>

            {/* 18. No Guarantee of Employment */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                17. Career, Employment &amp; Commercial Disclaimer
              </h3>
              <p className="text-xs sm:text-sm">
                The Academy provides vocational practical skill training and entrepreneurial boutique mentorship. The certificate confirms curriculum completion but <strong>does not constitute a guarantee of direct employment, corporate placement, fixed monthly earnings, customer volume, or commercial business success</strong>.
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Independent boutique earnings and fashion careers depend on individual talent, work ethic, pricing, market location, and entrepreneurial execution.
              </p>
            </div>

            {/* 19, 20, 21. Curriculum Changes, Records & Verification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-1.5">
                <h4 className="text-sm font-bold text-white">18. Curriculum Adjustments</h4>
                <p className="text-xs text-slate-400">
                  The Academy reserves the right to reasonably update practical modules, class schedules, or instructors to adapt to emerging couture trends or operational requirements.
                </p>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-1.5">
                <h4 className="text-sm font-bold text-white">19. Academic Records</h4>
                <p className="text-xs text-slate-400">
                  The Academy archives attendance logs, practical evaluation dossiers, and project photographs for administrative integrity and historical accreditation records.
                </p>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-1.5">
                <h4 className="text-sm font-bold text-white">20. Public Verification</h4>
                <p className="text-xs text-slate-400">
                  Employers, clients, and institutions may authenticate graduate certificate serial numbers through the Academy&apos;s official student verification desk.
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* CATEGORY 7: APPEALS, EXCEPTIONAL CIRCUMSTANCES & JURISDICTION */}
          {/* ============================================================ */}
          <section id="part-7" className="space-y-6 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <HelpCircle className="h-5 w-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-wide">
                Part 7: Appeals, Governance, Jurisdiction &amp; Student Undertaking
              </h2>
            </div>

            {/* 22. Review and Appeal */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                21. Grievance Review &amp; Formal Appeal Window
              </h3>
              <p>
                Where a student demonstrates a genuine administrative error, computational miscalculation, or procedural oversight regarding an assessment or certification outcome, they may submit a formal written review petition within <strong>14 calendar days</strong> of receiving the decision.
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                A review petition does not guarantee alteration of the final grade. Following internal academic committee re-examination, the Academy&apos;s determination shall be final and binding.
              </p>
            </div>

            {/* 23. Exceptional Circumstances */}
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                22. Genuine Exceptional Circumstances &amp; Medical Discretion
              </h3>
              <p className="text-xs sm:text-sm">
                In documented cases of severe medical emergency, bereavement, or force majeure events, the Academy management may consider appropriate make-up classes, deadline extensions, or reassessment slots. Concessions remain entirely discretionary on a case-by-case basis.
              </p>
            </div>

            {/* 24, 25, 26. Student Acceptance, Amendments & Jurisdiction */}
            <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  23. Binding Student Acceptance
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  By completing course enrollment, paying tuition fees, or participating in classroom instruction at Radhe Vastraz Academy, the student (and parent/guardian for minors) explicitly affirms having read, understood, and consented to these comprehensive Certificate Issuance, Assessment &amp; Certification Terms.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                <h4 className="text-sm font-bold text-white">24. Periodic Revisions &amp; Right to Amend</h4>
                <p className="text-xs text-slate-400">
                  The Academy reserves the right to periodically review and update these regulatory terms to maintain high educational benchmarks. Applicable amendments are communicated via official student notice boards and portal releases.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                <h4 className="text-sm font-bold text-white">25. Governing Law &amp; Judicial Jurisdiction</h4>
                <p className="text-xs text-slate-400">
                  These regulatory terms shall be governed by and construed in accordance with the laws of the Republic of India. Any unresolved dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Hyderabad / Telangana, India</strong>.
                </p>
              </div>
            </div>

            {/* Contact Person Card */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-[#D4AF37]/40 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#E6C875]" />
                Academic Inquiries &amp; Certification Administration
              </h3>
              <p className="text-xs text-slate-300">
                For certificate verification, enrollment status checks, or policy clarification, please visit or reach our admissions desk:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#E6C875] shrink-0 mt-0.5" />
                  <span>Shop No. 1, Jal Vayu Vihar, Kukatpally, backside of community office building, Hyderabad, Telangana (500085)</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#E6C875] shrink-0" />
                    <span><strong>+91 9063643342</strong> (Contact Person: Divya)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#E6C875] shrink-0" />
                    <span>radhevastraz@gmail.com</span>
                  </div>
                  <div className="text-slate-400 pl-5.5">
                    Support: raadhelabel@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-8 text-center text-xs text-slate-500 mt-16">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-0.5">
            <p className="text-slate-300 font-semibold">Radhe Vastraz Boutique &amp; Fashion Academy</p>
            <p className="text-slate-500">Shop No. 1, Jal Vayu Vihar, Kukatpally, Hyderabad (500085)</p>
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/thank-you" className="hover:text-white transition-colors">
              Thank You
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
