import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  LogIn,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLOUDINARY_ASSETS } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "Thank You | Application & Inquiry Received",
  description:
    "Thank you for contacting Radhe Vastraz Academy. Our academic admissions counselor will connect with you shortly regarding courses, batch schedules, and atelier walkthroughs.",
  robots: {
    index: false,
    follow: true,
  },
};

interface ThankYouProps {
  searchParams: Promise<{ type?: string; ref?: string; course?: string }>;
}

export default async function ThankYouPage({ searchParams }: ThankYouProps) {
  const params = await searchParams;
  const type = params.type ?? "general";
  const ref = params.ref;
  const course = params.course;

  const typeConfig: Record<
    string,
    { title: string; subtitle: string; badge: string }
  > = {
    admission: {
      title: "Enrollment Application Received!",
      subtitle:
        "Congratulations on taking the first step towards professional fashion designing and boutique craftsmanship at Radhe Vastraz Academy.",
      badge: "Admission & Founder's Batch Enrollment",
    },
    payment: {
      title: "Fee Payment Recorded Successfully!",
      subtitle:
        "Thank you! Your payment transaction has been recorded and an official institutional receipt has been issued to your student account.",
      badge: "Fee Payment Confirmation",
    },
    inquiry: {
      title: "Course Inquiry Received!",
      subtitle:
        "Our academic counselor will get in touch with you shortly to explain the curriculum, flexible batch timings, and the 40% Founder's Batch discount.",
      badge: "Course Inquiry & Consultation",
    },
    general: {
      title: "Thank You for Connecting With Us!",
      subtitle:
        "Your message has been received by the Radhe Vastraz Academy admissions team. We look forward to guiding you on your fashion journey.",
      badge: "Radhe Vastraz Academy",
    },
  };

  const fallbackConfig = {
    title: "Thank You for Connecting With Us!",
    subtitle:
      "Your message has been received by the Radhe Vastraz Academy admissions team. We look forward to guiding you on your fashion journey.",
    badge: "Radhe Vastraz Academy",
  };

  const config = typeConfig[type] ?? fallbackConfig;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F2] via-[#FCF5F2] to-[#FAF0ED] text-[#2D0612] flex flex-col justify-between selection:bg-[#6B1127] selection:text-[#E6C875]">
      {/* 1. Top Announcement Bar */}
      <div className="w-full bg-[#4A0E1C] text-[#F3E5D8] text-xs py-2 px-4 sm:px-8 border-b border-[#350A14]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-medium">
              Founder&apos;s Batch Open • Kukatpally, Hyderabad • Limited 6 Students Per Batch
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#E8D3C0]">
            <a
              href="tel:+919063643342"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Phone className="h-3 w-3 text-[#D4AF37]" />
              <span>Admissions: +91 9063643342 (Divya)</span>
            </a>
            <span className="hidden md:inline text-rose-300/40">|</span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 bg-[#D4AF37] hover:bg-[#E6C875] text-[#2A050E] px-2.5 py-0.5 rounded-md font-bold transition-colors shadow-xs"
            >
              <LogIn className="h-3 w-3" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="w-full border-b border-[#E8D3C0] bg-[#FFFDFB]/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-[#D4AF37] shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Image
                src={CLOUDINARY_ASSETS.logo}
                alt="Radhe Vastraz Boutique & Academy"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider text-[#2D0612] block font-serif">
                  RADHE VASTRAZ
                </span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded-md bg-[#6B1127] text-[#E6C875] font-semibold border border-[#D4AF37]/40">
                  ACADEMY
                </span>
              </div>
              <span className="text-[11px] uppercase tracking-widest text-[#7A3F4C] block font-medium -mt-0.5">
                Boutique &amp; Fashion Academy Hyderabad
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://wa.me/919063643342?text=Hello%20Divya%2C%20I%20have%20submitted%20my%20inquiry%20on%20the%20website%20and%20would%20like%20to%20know%20more%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-600/40 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 gap-1.5 h-9 px-3 rounded-lg font-medium text-xs"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span className="hidden sm:inline">WhatsApp Us</span>
              </Button>
            </a>

            <Link href="/">
              <Button
                size="sm"
                variant="outline"
                className="border-[#E8D3C0] bg-white text-[#2D0612] hover:bg-[#FFF5F2] text-xs h-9 px-3 rounded-lg"
              >
                Back to Home
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="sm"
                className="bg-[#6B1127] hover:bg-[#801431] text-white font-bold gap-1.5 h-9 px-4 rounded-lg shadow-xs text-xs"
              >
                Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Main Body Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center justify-center text-center">
        {/* Success Icon */}
        <div className="mb-6 relative">
          <div className="h-20 w-20 rounded-3xl bg-white border-2 border-[#D4AF37] flex items-center justify-center text-emerald-600 shadow-xl shadow-rose-950/5">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#6B1127] text-[#E6C875] border-2 border-white flex items-center justify-center shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#6B1127]/10 text-[#6B1127] border border-[#D4AF37]/50 mb-4">
          <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span>{config.badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2D0612] tracking-tight mb-3 font-serif leading-tight">
          {config.title}
        </h1>

        {/* Subtitle */}
        <p className="text-[#5A2530] text-base sm:text-lg max-w-2xl mb-6 leading-relaxed">
          {config.subtitle}
        </p>

        {/* Details Badge: Course or Ref */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {course && (
            <div className="px-3.5 py-1 rounded-md bg-white border border-[#E8D3C0] text-xs font-semibold text-[#6B1127] shadow-2xs">
              Course: <span className="text-[#2D0612]">{course}</span>
            </div>
          )}
          {ref && (
            <div className="px-3.5 py-1 rounded-md bg-white border border-[#E8D3C0] font-mono text-xs text-[#5A2530] shadow-2xs">
              Ref ID: <span className="font-bold text-[#6B1127]">{ref}</span>
            </div>
          )}
          <div className="px-3.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
            Founder&apos;s Batch: 40% Discount Applied
          </div>
        </div>

        {/* What Happens Next Roadmap Card */}
        <div className="w-full bg-white border border-[#E8D3C0] rounded-2xl p-6 sm:p-8 text-left mb-10 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#F0E2D6] pb-4 mb-6">
            <h2 className="text-base font-bold text-[#2D0612] font-serif uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#D4AF37]" />
              What Happens Next? (Next Steps)
            </h2>
            <span className="text-xs text-[#7A3F4C] font-medium hidden sm:inline">
              Step-by-step onboarding process
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="space-y-2 relative">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-[#6B1127] text-[#E6C875] flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  1
                </div>
                <h3 className="text-sm font-bold text-[#2D0612]">
                  Counselor Verification
                </h3>
              </div>
              <p className="text-xs text-[#6A4E56] leading-relaxed pt-1">
                Our academic coordinator, <strong>Divya</strong>, will review your details and reach out via phone or WhatsApp within <strong>24 business hours</strong> to discuss your schedule and syllabus requirements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 relative">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-[#6B1127] text-[#E6C875] flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  2
                </div>
                <h3 className="text-sm font-bold text-[#2D0612]">
                  Studio &amp; Machine Walkthrough
                </h3>
              </div>
              <p className="text-xs text-[#6A4E56] leading-relaxed pt-1">
                Visit our dedicated Kukatpally studio atelier in person to inspect industrial sewing workstations, professional pattern drafting tables, and meet your certified mentor.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 relative">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-[#6B1127] text-[#E6C875] flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  3
                </div>
                <h3 className="text-sm font-bold text-[#2D0612]">
                  Kit Handover &amp; Class Start
                </h3>
              </div>
              <p className="text-xs text-[#6A4E56] leading-relaxed pt-1">
                Complete your seat confirmation, receive your official Student ID code, batch timing timetable, and collect your complimentary fashion drafting toolkit.
              </p>
            </div>
          </div>

          {/* Quick Notice Banner inside card */}
          <div className="mt-6 pt-5 border-t border-[#F0E2D6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A2530]">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#D4AF37] shrink-0" />
              <span>Studio Hours: Monday – Saturday (10:00 AM – 7:00 PM IST)</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#6B1127]">
              <span>Direct WhatsApp Help:</span>
              <a
                href="https://wa.me/919063643342"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#801431]"
              >
                +91 9063643342
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons matching landing page */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link href="/#programs-section" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-[#6B1127] hover:bg-[#801431] text-white font-bold h-11 px-7 rounded-xl shadow-md gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Explore All 13 Courses</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <a
            href="https://wa.me/919063643342?text=Hello%20Divya%2C%20I%20have%20submitted%20my%20inquiry%20and%20would%20like%20to%20book%20a%20studio%20visit."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-6 rounded-xl shadow-md gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Connect on WhatsApp</span>
            </Button>
          </a>

          <Link href="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-[#E8D3C0] bg-white text-[#2D0612] hover:bg-[#FFF5F2] font-semibold h-11 px-6 rounded-xl"
            >
              <span>Student Portal Login</span>
            </Button>
          </Link>
        </div>

        {/* Studio Location & Admissions Helpline Box */}
        <div className="mt-12 pt-8 border-t border-[#E8D3C0] w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#5A2530]">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0" />
            <span className="text-left">
              Jal Vayu Vihar, Kukatpally, Hyderabad (500085)
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
            <span>Admissions Helpline: +91 9063643342 (Divya)</span>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Mail className="h-4 w-4 text-[#D4AF37] shrink-0" />
            <span>radhevastraz@gmail.com</span>
          </div>
        </div>
      </main>

      {/* 4. Grounded Contrast Footer matching landing page */}
      <footer className="border-t border-[#3D0A16] bg-[#24040E] py-10 text-xs text-[#E0D2C0] w-full px-4 sm:px-8 lg:px-12 2xl:px-16 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-[#D4AF37]/60 shadow-md shrink-0">
              <Image
                src={CLOUDINARY_ASSETS.logo}
                alt="Radhe Vastraz"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-white text-sm font-serif">
                Radhe Vastraz Boutique &amp; Fashion Academy
              </p>
              <p className="text-[#C8B8A6]">
                Shop No. 1, Jal Vayu Vihar, Kukatpally, Hyderabad (500085) • Divya: +91 9063643342
              </p>
              <p className="text-slate-400 mt-0.5">
                © {new Date().getFullYear()} Radhe Vastraz Academy. All rights reserved. • radhevastraz@gmail.com
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#E0D2C0]">
            <Link href="/" className="hover:text-[#E6C875] transition-colors">
              Academy Home
            </Link>
            <Link href="/privacy" className="hover:text-[#E6C875] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#E6C875] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link
              href="/login"
              className="hover:text-white text-[#E6C875] font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
