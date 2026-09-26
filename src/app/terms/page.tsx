import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  ShieldAlert,
  Phone,
  MapPin,
  Mail,
  FileCheck2,
  Award,
  AlertTriangle,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  Ban,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLOUDINARY_ASSETS } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "Terms and Conditions | Certificate Issuance, Assessment & Academic Policies",
  description:
    "Official Certificate Issuance, Assessment, Practical Training & Student Certification Terms of Radhe Vastraz Academy Hyderabad. Strict No-Refund Policy and Academic Guidelines.",
  openGraph: {
    title: "Certificate Issuance & Student Terms | Radhe Vastraz Academy",
    description:
      "Official academic policies, practical assessment benchmarks, attendance rules, strict no-refund terms, and certificate issuance regulations at Radhe Vastraz Academy.",
  },
};

export default function TermsPage() {
  const lastUpdated = "September 27, 2026";

  const quickNav = [
    { num: "1", title: "Purpose of Certification" },
    { num: "2", title: "Course Completion" },
    { num: "3", title: "100% Attendance" },
    { num: "4", title: "Practical Training" },
    { num: "5", title: "Coursework & Portfolio" },
    { num: "6", title: "Assessment & Exams" },
    { num: "7", title: "Passing Standards" },
    { num: "8", title: "Failure in Assessment" },
    { num: "9", title: "Academic Integrity" },
    { num: "10", title: "Student Conduct" },
    { num: "11", title: "Fees & Strict No-Refund" },
    { num: "12", title: "Certificate Details" },
    { num: "13", title: "Format & Mode of Issue" },
    { num: "14", title: "Duplicate Certificates" },
    { num: "15", title: "Revocation of Certificate" },
    { num: "16", title: "Recognition & Status" },
    { num: "17", title: "No Employment Guarantee" },
    { num: "18", title: "Curriculum Changes" },
    { num: "19", title: "Assessment Records" },
    { num: "20", title: "Certificate Verification" },
    { num: "21", title: "Review and Appeal" },
    { num: "22", title: "Exceptional Circumstances" },
    { num: "23", title: "Student Acceptance" },
    { num: "24", title: "Right to Amend" },
    { num: "25", title: "Governing Law & Jurisdiction" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-rose-950 selection:text-rose-200">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-white group">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-[#D4AF37] shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/images/radhe-vastraz-logo.png"
                src={CLOUDINARY_ASSETS.logo}
                alt="Radhe Vastraz Boutique & Academy"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-bold text-base tracking-wide block font-serif text-white">RADHE VASTRAZ</span>
              <span className="text-[10px] uppercase tracking-widest text-[#E6C875] block -mt-0.5 font-medium">
                Boutique &amp; Fashion Academy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919063643342?text=Hello%20Divya%2C%20I%20have%20an%20inquiry%20regarding%20the%20Academy%20Terms%20and%20Certification%20policy."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="border-emerald-600/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 text-xs gap-1.5 hidden sm:inline-flex">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>Admissions: 9063643342</span>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Navigation link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to Academy Home
          </Link>

          {/* Official Document Masthead */}
          <div className="border border-slate-800 bg-slate-900/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B1127]/30 border border-[#D4AF37]/40 text-[#E6C875] text-xs font-semibold uppercase tracking-wider">
              <Scale className="h-3.5 w-3.5" />
              Official Institutional Policy
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              CERTIFICATE ISSUANCE, ASSESSMENT &amp; STUDENT CERTIFICATION TERMS
            </h1>

            <div className="text-sm font-semibold text-[#E6C875] tracking-wide pt-1">
              RADHE VASTRAZ ACADEMY
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300 border-t border-slate-800/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Shop No. 1, Jal Vayu Vihar, Kukatpally, backside of community office building, Hyderabad, Telangana, India (500085)</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Admissions Helpline: <strong>+91 9063643342</strong> (Divya)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>radhevastraz@gmail.com | raadhelabel@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Building className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Website: https://academy.radhevastraz.in</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60">
              <span>Governing Jurisdiction: Hyderabad, Telangana, India</span>
              <span>Effective Date: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* STRICT NO REFUND CALLOUT BOX */}
        <div className="mb-10 rounded-2xl border-2 border-rose-900/60 bg-rose-950/20 p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold text-base sm:text-lg">
            <Ban className="h-5 w-5 text-rose-400 shrink-0" />
            <span>IMPORTANT NOTICE: STRICT NO-REFUND POLICY</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All course fees, registration charges, admission fees, module payments, and workshop dues paid to Radhe Vastraz Academy are <strong>strictly non-refundable, non-transferable, and non-adjustable under any circumstances</strong>. 
            Once enrolled, fee payments cannot be refunded, held in credit, carried forward, or transferred to another individual or future batch for any reason whatsoever (including voluntary withdrawal, personal emergency, scheduling conflicts, absenteeism, or failure in assessment).
          </p>
        </div>

        {/* Quick Navigation Anchor Grid */}
        <div className="mb-12 bg-slate-900/50 rounded-xl p-5 border border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#E6C875] mb-3 flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            Quick Table of Contents
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[11px]">
            {quickNav.map((item) => (
              <a
                key={item.num}
                href={`#section-${item.num}`}
                className="p-2 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 text-slate-300 hover:text-white transition-colors truncate block"
              >
                <span className="font-bold text-[#E6C875] mr-1.5">{item.num}.</span>
                {item.title}
              </a>
            ))}
          </div>
        </div>

        {/* Complete 26 Structured Sections */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          {/* 1. Purpose of Certification */}
          <section id="section-1" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">1</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Purpose of Certification</h2>
            </div>
            <p>
              The certificate issued by the Academy is intended to formally acknowledge that a student has fulfilled the Academy&apos;s prescribed training, attendance, practical learning and assessment requirements for the enrolled course.
            </p>
            <p>
              The certificate shall be issued only upon satisfactory completion of the requirements applicable to the relevant course.
            </p>
          </section>

          {/* 2. Course Completion Requirement */}
          <section id="section-2" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">2</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Course Completion Requirement</h2>
            </div>
            <p>
              Students are required to complete the full course duration, modules, lessons, practical sessions and other mandatory components prescribed for their enrolled course.
            </p>
            <p className="text-rose-300/90 font-medium">
              Completion of the scheduled course duration alone does not automatically entitle a student to receive a certificate.
            </p>
          </section>

          {/* 3. Attendance Requirement */}
          <section id="section-3" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">3</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Attendance Requirement</h2>
            </div>
            <p>
              Students must maintain the minimum attendance requirement prescribed by the Academy for the respective course.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs sm:text-sm text-slate-200">
              Unless otherwise specified in the course enrolment documents, the Academy requires a mandatory minimum attendance of <strong>[100%]</strong> for certificate eligibility.
            </div>
            <p>
              Absence from classes, repeated late attendance, leaving practical sessions early, or failure to participate in mandatory sessions may affect certificate eligibility.
            </p>
            <p className="text-xs text-slate-400">
              Where make-up or replacement classes are permitted, they shall be subject to the Academy&apos;s schedule and availability and may be subject to additional conditions or charges where applicable.
            </p>
          </section>

          {/* 4. Practical Training Requirement */}
          <section id="section-4" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">4</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Practical Training Requirement</h2>
            </div>
            <p>
              Students must actively participate in all mandatory practical training sessions and demonstrate the practical skills covered in the course.
            </p>
            <p className="font-medium text-slate-200">
              For boutique and fashion-related courses, practical requirements may include, where applicable:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pt-1">
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Garment construction and stitching</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Pattern making and cutting</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Measurements and fitting</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Fabric handling and selection</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Embroidery or other handwork</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Finishing techniques</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Design execution</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Machine handling</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Product or garment preparation</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded bg-slate-800/40 border border-slate-700/30">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Other practical competencies in curriculum</span>
              </li>
            </ul>
            <p className="text-xs text-slate-400 pt-1">
              The exact practical requirements shall depend on the specific enrolled course.
            </p>
          </section>

          {/* 5. Assignments, Projects and Portfolio Work */}
          <section id="section-5" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">5</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Assignments, Projects and Portfolio Work</h2>
            </div>
            <p>
              Where applicable, students must complete the assignments, projects, garment samples, practical records, portfolio work or other submissions prescribed by the Academy.
            </p>
            <p className="text-rose-300 font-medium">
              Failure to submit mandatory coursework or practical work may result in the student being declared ineligible for certification.
            </p>
          </section>

          {/* 6. Assessment and Examination */}
          <section id="section-6" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">6</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Assessment and Examination</h2>
            </div>
            <p>
              Students must complete all mandatory assessments prescribed for the course. Assessment may include one or more of the following:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Continuous practical evaluation</li>
              <li>Internal assessments</li>
              <li>Assignments and projects</li>
              <li>Portfolio evaluation</li>
              <li>Practical examination</li>
              <li>Final assessment</li>
              <li>Viva or oral evaluation</li>
              <li>Written or theoretical assessment, where applicable</li>
            </ul>
            <p className="text-xs text-slate-400">
              Assessment shall be based on the learning outcomes, practical competencies and evaluation criteria established by the Academy for the relevant course.
            </p>
          </section>

          {/* 7. Passing Requirement */}
          <section id="section-7" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">7</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Passing Requirement</h2>
            </div>
            <p>
              A student must achieve the minimum passing standard prescribed for the relevant course and demonstrate the required practical competency.
            </p>
            <p>
              A student who completes the course duration but does not meet the required assessment or competency standard shall not be automatically entitled to receive a certificate.
            </p>
            <p className="text-xs text-slate-400">
              The Academy may specify different assessment criteria for different courses.
            </p>
          </section>

          {/* 8. Failure in Final Assessment */}
          <section id="section-8" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">8</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Failure in Final Assessment</h2>
            </div>
            <p>
              A certificate will not be issued where a student fails to satisfy the minimum requirements of the final assessment or fails to demonstrate the required practical skills.
            </p>
            <p className="text-rose-300 font-medium">
              Course attendance or payment of fees does not by itself guarantee successful certification.
            </p>
          </section>

          {/* 9. Academic Integrity and Authentic Work (User Section 10) */}
          <section id="section-9" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">9</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Academic Integrity and Authentic Work</h2>
            </div>
            <p>
              Students must complete assessments, assignments, projects and practical work honestly and independently unless collaboration is specifically permitted by the Academy.
            </p>
            <p className="text-rose-300/90 text-xs sm:text-sm">
              Plagiarism, copying another student&apos;s work, submitting work completed substantially by another person, falsifying attendance or assessment records, or providing false information may result in cancellation or withholding of certification.
            </p>
          </section>

          {/* 10. Student Conduct (User Section 11) */}
          <section id="section-10" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">10</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Student Conduct</h2>
            </div>
            <p>
              Students are expected to maintain professional and respectful conduct towards trainers, staff and fellow students and comply with the Academy&apos;s classroom, workshop and safety rules.
            </p>
            <p className="text-xs sm:text-sm">
              Serious misconduct, harassment, abusive behaviour, intentional damage to Academy property, repeated violation of safety procedures, fraud or other serious disciplinary violations may result in suspension, removal from the course or withholding of certification, subject to the Academy&apos;s applicable disciplinary process.
            </p>
          </section>

          {/* 11. Course Fees, Strict No-Refund Policy and Administrative Requirements (User Section 12) */}
          <section id="section-11" className="scroll-mt-24 p-6 rounded-2xl bg-rose-950/20 border-2 border-rose-900/60 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-rose-900 text-white font-bold text-xs">11</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
                Course Fees, Strict No-Refund Policy &amp; Administrative Requirements
              </h2>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-800/40 space-y-2">
              <div className="text-rose-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Ban className="h-4 w-4" />
                STRICT NO-REFUND POLICY UNDER ALL CIRCUMSTANCES
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                There is absolutely NO REFUND policy at Radhe Vastraz Academy. All fees paid—including admission fees, registration charges, tuition fees, and course fees—are strictly non-refundable, non-transferable, and non-adjustable under any circumstances.
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1 pt-1">
                <li>No refund or partial refund shall be issued upon student withdrawal, cancellation, or absence.</li>
                <li>No fee adjustments, credit carryovers, or transfers to another student, future batch, or course will be entertained.</li>
                <li>Discontinuation of training, change of mind, personal or medical emergencies, or relocation do not qualify for any refund.</li>
              </ul>
            </div>

            <p>
              Unless otherwise stated in the Academy&apos;s admission or fee policy, students must complete all applicable fee and administrative requirements before the certificate is released.
            </p>
            <p className="text-xs text-slate-400">
              The certification decision is based on academic and practical requirements and is separate from any applicable fee or payment dispute.
            </p>
          </section>

          {/* 12. Certificate Details and Student Responsibility (User Section 13) */}
          <section id="section-12" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">12</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Certificate Details and Student Responsibility</h2>
            </div>
            <p>
              Students are responsible for providing accurate personal information at the time of registration, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Full legal name (matching government ID)</li>
              <li>Date of birth, where required</li>
              <li>Contact information (email, phone, address)</li>
              <li>Course name</li>
              <li>Other information requested by the Academy</li>
            </ul>
            <p>
              The certificate shall be prepared using the information available in the Academy&apos;s official student records.
            </p>
            <p className="text-xs text-slate-400">
              Students should verify their details before certificate issuance. Requests for corrections after issuance may be subject to verification and the Academy&apos;s certificate correction policy.
            </p>
          </section>

          {/* 13. Certificate Format and Mode of Issue (User Section 14) */}
          <section id="section-13" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">13</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Certificate Format and Mode of Issue</h2>
            </div>
            <p>
              The Academy may issue certificates in physical, digital or both formats, depending on the course and Academy policy.
            </p>
            <p className="text-xs text-slate-400">
              Certificate design, serial number, verification method, signatures, grading information and other certificate elements may vary by course or certification batch.
            </p>
          </section>

          {/* 14. Duplicate or Replacement Certificate (User Section 15) */}
          <section id="section-14" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">14</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Duplicate or Replacement Certificate</h2>
            </div>
            <p>
              A duplicate or replacement certificate may be issued in cases such as loss, damage, incorrect printing or other valid circumstances, subject to verification of Academy records.
            </p>
            <p className="text-xs text-slate-400">
              The Academy may require a formal application, identity verification and applicable administrative charges before issuing a replacement certificate.
            </p>
          </section>

          {/* 15. Withholding, Cancellation or Revocation of Certificate (User Section 16) */}
          <section id="section-15" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">15</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Withholding, Cancellation or Revocation of Certificate</h2>
            </div>
            <p>
              The Academy reserves the right to withhold, cancel or revoke a certificate where it is subsequently established that the certificate was obtained through:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-rose-300/90">
              <li>False or misleading information</li>
              <li>Fraudulent documentation</li>
              <li>Academic malpractice</li>
              <li>Plagiarism or impersonation</li>
              <li>Falsification of attendance or assessment records</li>
              <li>Any other material violation of the Academy&apos;s certification requirements</li>
            </ul>
            <p className="text-xs text-slate-400 pt-1">
              Where a certificate is revoked, the Academy may update its internal records and certificate verification status accordingly.
            </p>
          </section>

          {/* 16. Certificate Recognition and Status (User Section 17) */}
          <section id="section-16" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">16</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Certificate Recognition and Status</h2>
            </div>
            <p>
              Unless expressly stated otherwise in writing, the certificate issued by the Academy is an <strong>Academy-issued course completion/skill certificate</strong>.
            </p>
            <p className="text-xs sm:text-sm">
              It should not be represented as a government certificate, university degree, diploma, statutory professional licence, or certification issued by NSDC, NCVET, UGC, AICTE, a Sector Skill Council or any other external authority unless the Academy is formally authorised, affiliated, accredited or partnered with that authority for the relevant programme.
            </p>
            <p className="text-xs text-slate-400">
              Students must not make any misleading claim regarding the status, accreditation or recognition of the certificate. NSDC itself distinguishes recognised training-partner/awarding arrangements and authorised certification processes, so claims of affiliation or recognition should be made only where the relevant formal approval exists.
            </p>
          </section>

          {/* 17. No Guarantee of Employment or Business Success (User Section 18) */}
          <section id="section-17" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">17</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">No Guarantee of Employment or Business Success</h2>
            </div>
            <p>
              The Academy&apos;s certificate confirms completion of the applicable Academy requirements. It does not constitute a guarantee of employment, placement, income, customers, business success, fashion-industry opportunities or any particular professional outcome.
            </p>
            <p className="text-xs text-slate-400">
              Career outcomes depend on individual skills, experience, portfolio, market conditions and other personal factors.
            </p>
          </section>

          {/* 18. Academy Curriculum and Schedule Changes (User Section 19) */}
          <section id="section-18" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">18</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Academy Curriculum and Schedule Changes</h2>
            </div>
            <p>
              The Academy reserves the right to reasonably modify course content, teaching methods, trainers, practical exercises, class schedules or assessment methods where necessary to maintain course quality or accommodate operational requirements.
            </p>
            <p className="text-xs text-slate-400">
              Any material change affecting certification requirements should be communicated to students appropriately.
            </p>
          </section>

          {/* 19. Assessment Records (User Section 20) */}
          <section id="section-19" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">19</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Assessment Records</h2>
            </div>
            <p>
              The Academy may maintain attendance records, assessment results, practical evaluation records, submitted work and other academic records for the purpose of course administration, certification, verification and internal quality control.
            </p>
            <p className="text-xs text-slate-400">
              Students may be required to provide identification or other information reasonably necessary to verify their certification.
            </p>
          </section>

          {/* 20. Certificate Verification (User Section 21) */}
          <section id="section-20" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">20</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Certificate Verification</h2>
            </div>
            <p>
              The Academy may maintain a certificate register or verification system containing certificate number, student name, course name, completion date and other relevant certification information.
            </p>
            <p className="text-xs text-slate-400">
              Employers, clients or other third parties may be permitted to verify the authenticity of a certificate through the Academy&apos;s official verification process.
            </p>
          </section>

          {/* 21. Review and Appeal (User Section 22) */}
          <section id="section-21" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">21</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Review and Appeal</h2>
            </div>
            <p>
              Where a student believes there has been an administrative error, incorrect calculation, record mismatch or procedural issue relating to an assessment or certificate decision, the student may submit a written request for review within <strong>[7 to 15 days]</strong> of receiving the relevant decision.
            </p>
            <p>
              The Academy may review the relevant records and determine whether a correction or re-evaluation is appropriate.
            </p>
            <p className="text-xs text-slate-400">
              A review does not guarantee a change in the original result. Following completion of the Academy&apos;s review process, the Academy&apos;s decision shall be treated as final, subject to applicable law.
            </p>
          </section>

          {/* 22. Exceptional Circumstances (User Section 23) */}
          <section id="section-22" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">22</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Exceptional Circumstances</h2>
            </div>
            <p>
              The Academy may consider genuine exceptional circumstances, such as serious emergencies or other circumstances beyond the student&apos;s reasonable control, where appropriate.
            </p>
            <p className="text-xs text-slate-400">
              Any concession, extension, make-up class, re-assessment or other remedy shall be determined by the Academy on a case-by-case basis and shall not be treated as an automatic entitlement.
            </p>
          </section>

          {/* 23. Student Acceptance (User Section 24) */}
          <section id="section-23" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">23</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Student Acceptance</h2>
            </div>
            <p>
              By enrolling in the course and continuing participation in the Academy&apos;s programme, the student acknowledges that they have read, understood and accepted these Certificate Issuance, Assessment &amp; Student Certification Terms.
            </p>
            <p className="text-xs text-slate-400">
              Students are responsible for complying with the applicable academic, attendance, practical, assessment and conduct requirements.
            </p>
          </section>

          {/* 24. Right to Amend (User Section 25) */}
          <section id="section-24" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">24</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Right to Amend</h2>
            </div>
            <p>
              The Academy may periodically review and update these terms to reflect changes in its courses, assessment procedures, operational requirements or applicable legal requirements.
            </p>
            <p className="text-xs text-slate-400">
              The version applicable to the student&apos;s batch shall be communicated through the Academy&apos;s official admission or student communication channels.
            </p>
          </section>

          {/* 25. Governing Law and Dispute Resolution (User Section 26) */}
          <section id="section-25" className="scroll-mt-24 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-[#E6C875]">
              <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#6B1127] text-white font-bold text-xs">25</span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-serif">Governing Law and Dispute Resolution</h2>
            </div>
            <p>
              These terms shall be governed by the laws applicable in India.
            </p>
            <p>
              Any dispute concerning these terms or the Academy&apos;s services shall first be raised with the Academy through its designated grievance or administrative contact for resolution.
            </p>
            <p className="text-xs text-slate-400">
              Subject to applicable law, the courts located in <strong>Hyderabad, Telangana, India</strong> shall have exclusive jurisdiction over any legal matters arising from or in connection with these terms. Nothing in these terms shall be interpreted as excluding or restricting any legal right or remedy available to a student under applicable law.
            </p>
          </section>
        </div>

        {/* Student Undertaking & Contact Desk */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-[#E6C875]">
            <UserCheck className="h-5 w-5" />
            <h3 className="text-base sm:text-lg font-bold text-white font-serif">
              Student Declaration &amp; Academic Admissions Desk
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            For questions, clarification on practical assessments, course guidelines, or certificate verification, contact our administrative office:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="text-slate-400 block">Admissions &amp; Academic Coordinator:</span>
              <strong className="text-white text-sm block">Divya</strong>
              <span className="text-emerald-400 block font-mono">+91 9063643342</span>
              <span className="text-slate-400 text-[11px] block">Mon – Sat: 10:00 AM – 7:00 PM IST</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="text-slate-400 block">Official Support &amp; Verification Desk:</span>
              <strong className="text-white text-sm block">Radhe Vastraz Academy</strong>
              <span className="text-slate-300 block font-mono">radhevastraz@gmail.com</span>
              <span className="text-slate-400 block font-mono text-[11px]">raadhelabel@gmail.com</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} Radhe Vastraz Academy. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors underline">
                Privacy Policy
              </Link>
              <Link href="/" className="hover:text-white transition-colors underline">
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
