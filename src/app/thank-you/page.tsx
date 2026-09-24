import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  BookOpen,
  PhoneCall,
  Mail,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for reaching out to Radhe Vastraz Academy. We have received your inquiry/submission and will connect with you shortly.",
  robots: {
    index: false,
    follow: true,
  },
};

interface ThankYouProps {
  searchParams: Promise<{ type?: string; ref?: string }>;
}

export default async function ThankYouPage({ searchParams }: ThankYouProps) {
  const params = await searchParams;
  const type = params.type ?? "general";
  const ref = params.ref;

  const typeConfig: Record<
    string,
    { title: string; subtitle: string; badge: string }
  > = {
    admission: {
      title: "Enrollment Inquiry Received!",
      subtitle:
        "Congratulations on taking the first step towards mastering fashion design and boutique craftsmanship.",
      badge: "Admission & Registration",
    },
    payment: {
      title: "Payment Received Successfully!",
      subtitle:
        "Thank you! Your payment transaction has been recorded and an official receipt has been issued to your student account.",
      badge: "Fee Payment",
    },
    inquiry: {
      title: "Inquiry Submitted Successfully!",
      subtitle:
        "Our academic counselor will get in touch with you to explain our course curriculum, batch schedules, and flexible payment plans.",
      badge: "Course Inquiry",
    },
    general: {
      title: "Thank You for Reaching Out!",
      subtitle:
        "Your message has been received by the Radhe Vastraz Academy team. We look forward to assisting you on your journey.",
      badge: "Radhe Vastraz Academy",
    },
  };

  const fallbackConfig = {
    title: "Thank You for Reaching Out!",
    subtitle:
      "Your message has been received by the Radhe Vastraz Academy team. We look forward to assisting you on your journey.",
    badge: "Radhe Vastraz Academy",
  };

  const config = typeConfig[type] ?? fallbackConfig;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-foreground flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white group">
            <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight block">
                Radhe Vastraz
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block -mt-1 font-medium">
                Academy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/academy/courses">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                <BookOpen className="h-4 w-4 mr-1.5" />
                Courses
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" variant="default" className="shadow-sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 sm:py-16 flex flex-col items-center justify-center text-center">
        {/* Success Badge */}
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/40">
            <CheckCircle2 className="h-10 w-10 animate-in zoom-in-75 duration-300" />
          </div>
          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary animate-pulse">
            <Sparkles className="h-3 w-3" />
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800 mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          {config.badge}
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          {config.title}
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-xl mb-6 leading-relaxed">
          {config.subtitle}
        </p>

        {ref && (
          <div className="mb-8 inline-block px-4 py-1.5 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-xs text-slate-300">
            Reference ID: <span className="font-semibold text-white">{ref}</span>
          </div>
        )}

        {/* Roadmap / Next Steps */}
        <Card className="w-full bg-slate-900/80 border-slate-800 text-left mb-8 shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> What happens next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Review & Counselor Connection</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Our academic counselor will verify your requirements and contact you via phone or WhatsApp within 24 business hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Curriculum & Studio Walkthrough</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    You can schedule an in-person visit to our studio atelier to inspect sewing workstations, cutting tables, and meet our senior instructors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Batch Allocation & Kit Handover</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Upon final confirmation, you will receive your student ID, class timings schedule, and your starter drafting tool kit.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/academy/courses" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2">
              Browse All Courses
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800">
              Student / Staff Portal
            </Button>
          </Link>
        </div>

        {/* Contact info bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 w-full flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-3.5 w-3.5 text-primary" />
            <span>Admissions Helpline: +91 98765 43210</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>Email: admissions@radhevastraz.in</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Radhe Vastraz Academy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/academy/courses" className="hover:text-slate-400 transition-colors">
              Courses
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

