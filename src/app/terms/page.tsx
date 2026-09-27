import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Globe } from "lucide-react";
import { CLOUDINARY_ASSETS } from "@/lib/cloudinary";
import { PrintDocumentButton } from "@/components/common/print-document-button";

export const dynamic = "force-static";
export const revalidate = false;

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
  const docRef = "RVA/POL/CERT-2026/01";

  const sections = [
    { num: "1", title: "Purpose of Certification" },
    { num: "2", title: "Course Completion Requirement" },
    { num: "3", title: "Attendance Requirement (100% Mandatory)" },
    { num: "4", title: "Practical Training Requirement" },
    { num: "5", title: "Assignments, Projects and Portfolio Work" },
    { num: "6", title: "Assessment and Examination" },
    { num: "7", title: "Passing Requirement" },
    { num: "8", title: "Failure in Final Assessment" },
    { num: "9", title: "Academic Integrity and Authentic Work" },
    { num: "10", title: "Student Conduct" },
    { num: "11", title: "Course Fees & Strict No-Refund Policy" },
    { num: "12", title: "Certificate Details and Student Responsibility" },
    { num: "13", title: "Certificate Format and Mode of Issue" },
    { num: "14", title: "Duplicate or Replacement Certificate" },
    { num: "15", title: "Withholding, Cancellation or Revocation of Certificate" },
    { num: "16", title: "Certificate Recognition and Status" },
    { num: "17", title: "No Guarantee of Employment or Business Success" },
    { num: "18", title: "Academy Curriculum and Schedule Changes" },
    { num: "19", title: "Assessment Records" },
    { num: "20", title: "Certificate Verification" },
    { num: "21", title: "Review and Appeal" },
    { num: "22", title: "Exceptional Circumstances" },
    { num: "23", title: "Student Acceptance" },
    { num: "24", title: "Right to Amend" },
    { num: "25", title: "Governing Law and Dispute Resolution" },
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
            href="/privacy"
            className="text-stone-600 hover:text-stone-950 transition-colors underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          <a
            href="https://wa.me/919063643342?text=Hello%20Divya%2C%20I%20have%20an%20inquiry%20regarding%20the%20Academy%20Terms%20and%20Certification%20policy."
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
            Certificate Issuance, Assessment &amp; Student Certification Terms
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl mx-auto">
            Official institutional guidelines governing course participation, mandatory 100% attendance, practical evaluations, assessment standards, certification eligibility, and student fee policies.
          </p>
        </div>

        {/* Notice Box: Strict No-Refund Policy */}
        <div className="my-6 border-2 border-stone-900 bg-stone-50 p-4 sm:p-5 text-stone-900">
          <div className="font-serif font-bold text-sm uppercase tracking-wide text-stone-950 mb-1.5">
            Important Notice: Strict No-Refund Policy Under All Circumstances
          </div>
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
            All course fees, registration charges, admission fees, module payments, and workshop dues paid to Radhe Vastraz Academy are <strong>strictly non-refundable, non-transferable, and non-adjustable under any circumstances</strong>. Once enrolled, fee payments cannot be refunded, held in credit, carried forward, or transferred to another individual or future batch for any reason whatsoever (including voluntary withdrawal, personal or medical emergencies, scheduling conflicts, absenteeism, or failure in assessment).
          </p>
        </div>

        {/* Minimal Table of Contents */}
        <nav aria-label="Table of Contents" className="my-8 p-4 bg-stone-50 border border-stone-200 rounded-[2px] print:hidden">
          <div className="font-serif font-bold text-xs uppercase tracking-wider text-stone-800 mb-2.5">
            Table of Contents
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 text-xs text-stone-700">
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

        {/* 25 Document Sections */}
        <div className="space-y-7 text-[15px] text-stone-800 leading-relaxed">
          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-6 pt-2">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              1. Purpose of Certification
            </h3>
            <p className="mb-2">
              The certificate issued by the Academy is intended to formally acknowledge that a student has fulfilled the Academy&apos;s prescribed training, attendance, practical learning and assessment requirements for the enrolled course.
            </p>
            <p>
              The certificate shall be issued only upon satisfactory completion of the requirements applicable to the relevant course.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              2. Course Completion Requirement
            </h3>
            <p className="mb-2">
              Students are required to complete the full course duration, modules, lessons, practical sessions and other mandatory components prescribed for their enrolled course.
            </p>
            <p className="font-medium text-stone-900">
              Completion of the scheduled course duration alone does not automatically entitle a student to receive a certificate.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              3. Attendance Requirement
            </h3>
            <p className="mb-2">
              Students must maintain the minimum attendance requirement prescribed by the Academy for the respective course.
            </p>
            <p className="mb-2 font-medium text-stone-900">
              Unless otherwise specified in the course enrolment documents, the Academy requires a mandatory minimum attendance of <strong>100%</strong> for certificate eligibility.
            </p>
            <p className="mb-2">
              Absence from classes, repeated late attendance, leaving practical sessions early, or failure to participate in mandatory sessions may affect certificate eligibility.
            </p>
            <p className="text-xs text-stone-600">
              Where make-up or replacement classes are permitted, they shall be subject to the Academy&apos;s schedule and availability and may be subject to additional conditions or charges where applicable.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              4. Practical Training Requirement
            </h3>
            <p className="mb-2">
              Students must actively participate in all mandatory practical training sessions and demonstrate the practical skills covered in the course.
            </p>
            <p className="mb-2 text-stone-900 font-medium">
              For boutique and fashion-related courses, practical requirements include, where applicable:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-stone-800">
              <li>Garment construction and stitching</li>
              <li>Pattern making and cutting</li>
              <li>Measurements and fitting</li>
              <li>Fabric handling and selection</li>
              <li>Embroidery or other handwork</li>
              <li>Finishing techniques</li>
              <li>Design execution</li>
              <li>Machine handling</li>
              <li>Product or garment preparation</li>
              <li>Other practical competencies specified in the course curriculum</li>
            </ul>
            <p className="mt-2 text-xs text-stone-600">
              The exact practical requirements shall depend on the enrolled course.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              5. Assignments, Projects and Portfolio Work
            </h3>
            <p className="mb-2">
              Where applicable, students must complete the assignments, projects, garment samples, practical records, portfolio work or other submissions prescribed by the Academy.
            </p>
            <p className="font-medium text-stone-900">
              Failure to submit mandatory coursework or practical work may result in the student being declared ineligible for certification.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              6. Assessment and Examination
            </h3>
            <p className="mb-2">
              Students must complete all mandatory assessments prescribed for the course. Assessment may include one or more of the following:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-stone-800">
              <li>Continuous practical evaluation</li>
              <li>Internal assessments</li>
              <li>Assignments and projects</li>
              <li>Portfolio evaluation</li>
              <li>Practical examination</li>
              <li>Final assessment</li>
              <li>Viva or oral evaluation</li>
              <li>Written or theoretical assessment, where applicable</li>
            </ul>
            <p className="mt-2 text-xs text-stone-600">
              Assessment shall be based on the learning outcomes, practical competencies and evaluation criteria established by the Academy for the relevant course.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              7. Passing Requirement
            </h3>
            <p className="mb-2">
              A student must achieve the minimum passing standard prescribed for the relevant course and demonstrate the required practical competency.
            </p>
            <p className="mb-2">
              A student who completes the course duration but does not meet the required assessment or competency standard shall not be automatically entitled to receive a certificate.
            </p>
            <p className="text-xs text-stone-600">
              The Academy may specify different assessment criteria for different courses.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              8. Failure in Final Assessment
            </h3>
            <p className="mb-2">
              A certificate will not be issued where a student fails to satisfy the minimum requirements of the final assessment or fails to demonstrate the required practical skills.
            </p>
            <p className="font-medium text-stone-900">
              Course attendance or payment of fees does not by itself guarantee successful certification.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 9 */}
          <section id="section-9" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              9. Academic Integrity and Authentic Work
            </h3>
            <p className="mb-2">
              Students must complete assessments, assignments, projects and practical work honestly and independently unless collaboration is specifically permitted by the Academy.
            </p>
            <p>
              Plagiarism, copying another student&apos;s work, submitting work completed substantially by another person, falsifying attendance or assessment records, or providing false information may result in cancellation or withholding of certification.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 10 */}
          <section id="section-10" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              10. Student Conduct
            </h3>
            <p className="mb-2">
              Students are expected to maintain professional and respectful conduct towards trainers, staff and fellow students and comply with the Academy&apos;s classroom, workshop and safety rules.
            </p>
            <p>
              Serious misconduct, harassment, abusive behaviour, intentional damage to Academy property, repeated violation of safety procedures, fraud or other serious disciplinary violations may result in suspension, removal from the course or withholding of certification, subject to the Academy&apos;s applicable disciplinary process.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 11 */}
          <section id="section-11" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              11. Course Fees, Strict No-Refund Policy and Administrative Requirements
            </h3>
            <div className="border border-stone-900 bg-stone-50 p-4 mb-3">
              <div className="font-bold text-xs uppercase tracking-wide text-stone-950 mb-1">
                Zero Refund Clause
              </div>
              <p className="text-xs sm:text-sm text-stone-800">
                All fees paid—including admission fees, registration charges, tuition fees, and course fees—are strictly non-refundable, non-transferable, and non-adjustable under any circumstances. No refunds or partial refunds will be granted upon student withdrawal, discontinuation, cancellation, absenteeism, or relocation.
              </p>
            </div>
            <p className="mb-2">
              Unless otherwise stated in the Academy&apos;s admission or fee policy, students must complete all applicable fee and administrative requirements before the certificate is released.
            </p>
            <p className="text-xs text-stone-600">
              The certification decision is based on academic and practical requirements and is separate from any applicable fee or payment dispute.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 12 */}
          <section id="section-12" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              12. Certificate Details and Student Responsibility
            </h3>
            <p className="mb-2">
              Students are responsible for providing accurate personal information at the time of registration, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-stone-800 mb-2">
              <li>Full legal name (matching government-issued photo ID)</li>
              <li>Date of birth, where required</li>
              <li>Contact information (email, phone, address)</li>
              <li>Course name</li>
              <li>Other information requested by the Academy</li>
            </ul>
            <p className="mb-2">
              The certificate shall be prepared using the information available in the Academy&apos;s official student records.
            </p>
            <p className="text-xs text-stone-600">
              Students should verify their details before certificate issuance. Requests for corrections after issuance may be subject to verification and the Academy&apos;s certificate correction policy.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 13 */}
          <section id="section-13" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              13. Certificate Format and Mode of Issue
            </h3>
            <p className="mb-2">
              The Academy may issue certificates in physical, digital or both formats, depending on the course and Academy policy.
            </p>
            <p className="text-xs text-stone-600">
              Certificate design, serial number, verification method, signatures, grading information and other certificate elements may vary by course or certification batch.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 14 */}
          <section id="section-14" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              14. Duplicate or Replacement Certificate
            </h3>
            <p className="mb-2">
              A duplicate or replacement certificate may be issued in cases such as loss, damage, incorrect printing or other valid circumstances, subject to verification of Academy records.
            </p>
            <p className="text-xs text-stone-600">
              The Academy may require an application, identity verification and applicable administrative charges before issuing a replacement certificate.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 15 */}
          <section id="section-15" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              15. Withholding, Cancellation or Revocation of Certificate
            </h3>
            <p className="mb-2">
              The Academy reserves the right to withhold, cancel or revoke a certificate where it is subsequently established that the certificate was obtained through:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-stone-800 mb-2">
              <li>False or misleading information</li>
              <li>Fraudulent documentation</li>
              <li>Academic malpractice</li>
              <li>Plagiarism or impersonation</li>
              <li>Falsification of attendance or assessment records</li>
              <li>Any other material violation of the Academy&apos;s certification requirements</li>
            </ul>
            <p className="text-xs text-stone-600">
              Where a certificate is revoked, the Academy may update its internal records and certificate verification status accordingly.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 16 */}
          <section id="section-16" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              16. Certificate Recognition and Status
            </h3>
            <p className="mb-2">
              Unless expressly stated otherwise in writing, the certificate issued by the Academy is an <strong>Academy-issued course completion/skill certificate</strong>.
            </p>
            <p className="mb-2">
              It should not be represented as a government certificate, university degree, diploma, statutory professional licence, or certification issued by NSDC, NCVET, UGC, AICTE, a Sector Skill Council or any other external authority unless the Academy is formally authorised, affiliated, accredited or partnered with that authority for the relevant programme.
            </p>
            <p className="text-xs text-stone-600">
              Students must not make any misleading claim regarding the status, accreditation or recognition of the certificate. NSDC itself distinguishes recognised training-partner/awarding arrangements and authorised certification processes, so claims of affiliation or recognition should be made only where the relevant formal approval exists.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 17 */}
          <section id="section-17" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              17. No Guarantee of Employment or Business Success
            </h3>
            <p className="mb-2">
              The Academy&apos;s certificate confirms completion of the applicable Academy requirements. It does not constitute a guarantee of employment, placement, income, customers, business success, fashion-industry opportunities or any particular professional outcome.
            </p>
            <p className="text-xs text-stone-600">
              Career outcomes depend on individual skills, experience, portfolio, market conditions and other external factors.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 18 */}
          <section id="section-18" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              18. Academy Curriculum and Schedule Changes
            </h3>
            <p className="mb-2">
              The Academy reserves the right to reasonably modify course content, teaching methods, trainers, practical exercises, class schedules or assessment methods where necessary to maintain course quality or accommodate operational requirements.
            </p>
            <p className="text-xs text-stone-600">
              Any material change affecting certification requirements should be communicated to students appropriately.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 19 */}
          <section id="section-19" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              19. Assessment Records
            </h3>
            <p className="mb-2">
              The Academy may maintain attendance records, assessment results, practical evaluation records, submitted work and other academic records for the purpose of course administration, certification, verification and internal quality control.
            </p>
            <p className="text-xs text-stone-600">
              Students may be required to provide identification or other information reasonably necessary to verify their certification.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 20 */}
          <section id="section-20" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              20. Certificate Verification
            </h3>
            <p className="mb-2">
              The Academy may maintain a certificate register or verification system containing certificate number, student name, course name, completion date and other relevant certification information.
            </p>
            <p className="text-xs text-stone-600">
              Employers, clients or other third parties may be permitted to verify the authenticity of a certificate through the Academy&apos;s official verification process.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 21 */}
          <section id="section-21" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              21. Review and Appeal
            </h3>
            <p className="mb-2">
              Where a student believes there has been an administrative error, incorrect calculation, record mismatch or procedural issue relating to an assessment or certificate decision, the student may submit a written request for review within <strong>7 to 15 days</strong> of receiving the relevant decision.
            </p>
            <p className="mb-2">
              The Academy may review the relevant records and determine whether a correction or re-evaluation is appropriate.
            </p>
            <p className="text-xs text-stone-600">
              A review does not guarantee a change in the original result. Following completion of the Academy&apos;s review process, the Academy&apos;s decision shall be treated as final, subject to applicable law.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 22 */}
          <section id="section-22" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              22. Exceptional Circumstances
            </h3>
            <p className="mb-2">
              The Academy may consider genuine exceptional circumstances, such as serious emergencies or other circumstances beyond the student&apos;s reasonable control, where appropriate.
            </p>
            <p className="text-xs text-stone-600">
              Any concession, extension, make-up class, re-assessment or other remedy shall be determined by the Academy on a case-by-case basis and shall not be treated as an automatic entitlement.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 23 */}
          <section id="section-23" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              23. Student Acceptance
            </h3>
            <p className="mb-2">
              By enrolling in the course and continuing participation in the Academy&apos;s programme, the student acknowledges that they have read, understood and accepted these Certificate Issuance, Assessment &amp; Student Certification Terms.
            </p>
            <p className="text-xs text-stone-600">
              Students are responsible for complying with the applicable academic, attendance, practical, assessment and conduct requirements.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 24 */}
          <section id="section-24" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              24. Right to Amend
            </h3>
            <p className="mb-2">
              The Academy may periodically review and update these terms to reflect changes in its courses, assessment procedures, operational requirements or applicable legal requirements.
            </p>
            <p className="text-xs text-stone-600">
              The version applicable to the student&apos;s batch shall be communicated through the Academy&apos;s official admission or student communication channels.
            </p>
          </section>

          <hr className="border-t border-stone-200" />

          {/* Section 25 */}
          <section id="section-25" className="scroll-mt-6">
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-950 mb-2">
              25. Governing Law and Dispute Resolution
            </h3>
            <p className="mb-2">
              These terms shall be governed by the laws applicable in India.
            </p>
            <p className="mb-2">
              Any dispute concerning these terms or the Academy&apos;s services shall first be raised with the Academy through its designated grievance or administrative contact for resolution.
            </p>
            <p className="text-xs text-stone-600">
              Subject to applicable law, the courts located in <strong>Hyderabad, Telangana, India</strong> shall have exclusive jurisdiction over any legal matters arising from or in connection with these terms.
            </p>
          </section>
        </div>

        {/* Formal Paper Signature & Undertaking Block */}
        <div className="mt-14 pt-8 border-t-2 border-stone-900 break-inside-avoid">
          <div className="font-serif font-bold text-sm uppercase tracking-wider text-stone-950 mb-3">
            Student Acknowledgement &amp; Institutional Endorsement
          </div>
          <p className="text-xs text-stone-700 leading-relaxed mb-8">
            I hereby certify and declare that I have carefully read, understood, and agreed to be bound by all the provisions, assessment criteria, 100% attendance requirement, disciplinary rules, and the strict No-Refund policy stated in this document.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4 text-xs text-stone-800">
            <div className="space-y-4">
              <div className="border-b border-stone-400 pb-1 text-stone-600">
                Student Full Name:
              </div>
              <div className="border-b border-stone-400 pb-1 text-stone-600">
                Course Enrolled &amp; Batch:
              </div>
              <div className="border-b border-stone-400 pb-1 text-stone-600">
                Student Signature &amp; Date:
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b border-stone-400 pb-1 text-stone-600">
                Authorized Signatory: <strong>Radhe Vastraz Academy</strong>
              </div>
              <div className="border-b border-stone-400 pb-1 text-stone-600">
                Designation: Academic Dean / Admissions Coordinator
              </div>
              <div className="h-14 border border-dashed border-stone-400 flex items-center justify-center text-stone-400 uppercase text-[11px] tracking-widest">
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
          <Link href="/privacy" className="hover:text-stone-900 underline underline-offset-4">
            Privacy Policy
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
