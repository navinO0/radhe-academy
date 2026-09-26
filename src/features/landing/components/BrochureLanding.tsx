"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Scissors,
  Sparkles,
  Palette,
  PhoneCall,
  MessageCircle,
  Award,
  Layers,
  Heart,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Eye,
  Download,
  Calendar,
  Clock,
  Tag,
  ShieldCheck,
  ChevronRight,
  Star,
  MapPin,
  ExternalLink,
  BookOpen,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BROCHURE_CATEGORIES,
  GENERAL_INCLUSIONS,
  BrochureCategory,
  ProgramItem,
} from "../data/brochure-data";
import { formatCurrency } from "@/lib/utils";

interface BrochureLandingProps {
  userSession?: {
    userName?: string | null;
    userEmail?: string | null;
  } | null;
}

export function BrochureLanding({ userSession }: BrochureLandingProps) {
  const router = useRouter();

  // Selected tab: "all" or specific category id
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Brochure Preview Modal
  const [previewBrochure, setPreviewBrochure] = useState<{
    isOpen: boolean;
    imageSrc: string;
    title: string;
    categoryTitle: string;
  }>({
    isOpen: false,
    imageSrc: "",
    title: "",
    categoryTitle: "",
  });

  // Fast inquiry state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCourse, setInquiryCourse] = useState("Master Boutique Course");
  const [inquiryBatch, setInquiryBatch] = useState("Morning Batch (10:00 AM - 1:00 PM)");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered categories
  const displayedCategories =
    activeCategory === "all"
      ? BROCHURE_CATEGORIES
      : BROCHURE_CATEGORIES.filter((c) => c.id === activeCategory);

  const totalCourseCount = BROCHURE_CATEGORIES.reduce(
    (acc, cat) => acc + cat.programs.length,
    0
  );

  const handleOpenBrochure = (category: BrochureCategory) => {
    setPreviewBrochure({
      isOpen: true,
      imageSrc: category.brochureImage,
      title: category.title,
      categoryTitle: category.shortTitle,
    });
  };

  const handleCourseInquire = (courseName: string) => {
    setInquiryCourse(courseName);
    const formElement = document.getElementById("inquiry-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const refCode = "RV-" + Math.floor(100000 + Math.random() * 900000);
    // Smooth redirect to Thank You page with admission reference
    setTimeout(() => {
      router.push(`/thank-you?type=admission&ref=${refCode}`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-amber-950 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium border-b border-rose-950/60 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-bold tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Founder&apos;s Batch Admissions Open Now!
          </span>
          <span className="hidden md:inline text-rose-300">•</span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-amber-200 font-semibold border border-white/10">
            Special 40% OFF
          </span>
          <span className="hidden sm:inline text-rose-200">Limited Seats Available</span>
          <span className="hidden md:inline text-rose-300">•</span>
          <a
            href="tel:9063643342"
            className="inline-flex items-center gap-1 text-white hover:text-amber-300 underline underline-offset-2 font-bold transition-colors"
          >
            <PhoneCall className="h-3 w-3" /> Call: 9063643342
          </a>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl sticky top-9 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-primary/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
                  RADHE VASTRAZ
                </span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  ACADEMY
                </span>
              </div>
              <span className="text-[11px] uppercase tracking-widest text-slate-400 block font-medium -mt-0.5">
                Boutique & Fashion Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-300 font-medium">
            <a href="#programs-section" className="hover:text-amber-400 transition-colors">
              Programs
            </a>
            <a href="#fee-tables" className="hover:text-amber-400 transition-colors">
              Fee Structure
            </a>
            <a href="#features-section" className="hover:text-amber-400 transition-colors">
              What&apos;s Included
            </a>
            <a href="#fabric-art-section" className="hover:text-amber-400 transition-colors">
              Fabric Painting
            </a>
            <a href="#inquiry-form-section" className="hover:text-amber-400 transition-colors">
              Admissions
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://wa.me/919063643342?text=Hi%20Radhe%20Vastraz%20Academy%2C%20I%20am%20interested%20in%20learning%20more%20about%20your%20courses."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-600/40 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 gap-1.5"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </a>

            {userSession ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white gap-1.5 shadow-md">
                  <LayoutDashboardIcon className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
                  Student Portal
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-950/20 via-amber-950/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 text-amber-300 border border-amber-500/30 mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>HYDERABAD&apos;S PREMIER FASHION & BOUTIQUE ACADEMY</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Turn Your Passion for Fashion into a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200">
              Career or Business!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Dreaming of starting your own boutique or becoming a certified designer? Join our hands-on
            vocational atelier with practical studio training and lifetime entrepreneurial mentorship.
          </p>

          {/* Highlight Cards Row */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">40% OFF</div>
              <div className="text-xs text-slate-400 mt-0.5">Founder&apos;s Batch Fee</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-rose-400">13 Courses</div>
              <div className="text-xs text-slate-400 mt-0.5">3 Segregated Tracks</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">100% Practical</div>
              <div className="text-xs text-slate-400 mt-0.5">Sewing, Cutting & Art</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-sky-400">₹2,000</div>
              <div className="text-xs text-slate-400 mt-0.5">One-Time Admission</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="#programs-section" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-semibold shadow-lg shadow-amber-950/50 gap-2 h-12 px-6">
                Explore All 13 Programs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>

            <a
              href="https://wa.me/919063643342?text=Hello%2C%20I%20would%20like%20to%20enroll%20for%20a%20course%20at%20Radhe%20Vastraz%20Academy."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-emerald-600/50 text-emerald-300 hover:bg-emerald-950/40 gap-2 h-12 px-6">
                <MessageCircle className="h-5 w-5 text-emerald-400" />
                Chat with Counselor (WhatsApp)
              </Button>
            </a>

            <a href="#inquiry-form-section" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto text-slate-300 hover:text-white hover:bg-slate-800 h-12 px-6">
                Apply for Admission &rarr;
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Interactive Program Segregation & Explorer */}
      <section id="programs-section" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-amber-400 border-amber-500/30 mb-3 px-3 py-1">
            Official Curriculum & Brochures
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Your Creative Career Track
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Explore programs segregated across Boutique Tailoring, Fashion Designing, and Traditional Artisan Fabric Painting.
          </p>
        </div>

        {/* Category Segregation Switcher Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeCategory === "all"
                  ? "bg-amber-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>All Tracks</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                {totalCourseCount}
              </span>
            </button>

            {BROCHURE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {cat.id === "boutique" && <Scissors className="h-3.5 w-3.5" />}
                {cat.id === "fashion-designing" && <Sparkles className="h-3.5 w-3.5" />}
                {cat.id === "fabric-painting" && <Palette className="h-3.5 w-3.5" />}
                <span>{cat.shortTitle}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                  {cat.programs.length}
                </span>
              </button>
            ))}
          </div>

          {/* View toggle (Cards vs Table) */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-400">
            <span>View:</span>
            <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === "cards" ? "bg-slate-800 text-white font-medium" : "hover:text-white"
                }`}
              >
                Cards View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === "table" ? "bg-slate-800 text-white font-medium" : "hover:text-white"
                }`}
              >
                Table Matrix
              </button>
            </div>
          </div>
        </div>

        {/* Displaying Categories */}
        <div className="space-y-16">
          {displayedCategories.map((category) => (
            <div
              key={category.id}
              className="space-y-6 pt-2"
              id={`cat-${category.id}`}
            >
              {/* Category Header Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {category.badge}
                    </span>
                    <span className="text-xs text-slate-400">
                      {category.programs.length} Certified Programs
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {category.title}
                  </h3>
                  <p className="text-sm sm:text-base text-rose-200/90 font-medium">
                    &ldquo;{category.tagline}&rdquo; — {category.subtitle}
                  </p>
                </div>

                {/* Brochure View button */}
                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    onClick={() => handleOpenBrochure(category)}
                    variant="outline"
                    className="border-amber-500/40 text-amber-300 hover:bg-amber-950/40 gap-2 shadow-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View Original Flyer
                  </Button>
                </div>
              </div>

              {/* Mode: Cards View */}
              {viewMode === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {category.programs.map((program) => (
                    <Card
                      key={program.id}
                      className={`relative flex flex-col justify-between bg-slate-900/80 border-slate-800 hover:border-amber-500/40 transition-all hover:shadow-xl hover:-translate-y-0.5 ${
                        program.bestValue
                          ? "ring-1 ring-amber-500/50"
                          : program.popular
                          ? "ring-1 ring-rose-500/40"
                          : ""
                      }`}
                    >
                      {/* Ribbon tag */}
                      {program.bestValue && (
                        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md">
                          ★ Most Recommended
                        </div>
                      )}
                      {program.popular && !program.bestValue && (
                        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md">
                          Popular Choice
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <CardTitle className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                            {program.name}
                          </CardTitle>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md font-medium w-fit">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Duration: {program.duration}</span>
                        </div>
                        <CardDescription className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                          {program.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-0">
                        {/* Price box */}
                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-slate-400">Regular Tuition:</span>
                            <span className="text-xs line-through text-slate-500 font-mono">
                              {formatCurrency(program.regularFee.toString())}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-xs font-semibold text-rose-300 block">
                                Founder&apos;s Batch:
                              </span>
                              <span className="text-[10px] text-emerald-400 font-medium">
                                Flat 40% OFF Special
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-extrabold text-amber-400 font-mono block">
                                {formatCurrency(program.foundersFee.toString())}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-medium block">
                                You Save {formatCurrency(program.savings.toString())}
                              </span>
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-500 border-t border-slate-800/60 pt-1.5 text-right">
                            + Admission Fee: ₹{category.admissionFee} (one-time)
                          </div>
                        </div>

                        {/* Program highlights list */}
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                            Key Skills Covered:
                          </p>
                          <ul className="space-y-1 text-xs text-slate-300">
                            {program.highlights.slice(0, 3).map((h, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA button */}
                        <div className="pt-2">
                          <Button
                            onClick={() => handleCourseInquire(program.name)}
                            className="w-full bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-200 transition-colors gap-2 text-xs h-9"
                          >
                            <span>Enroll in This Program</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Mode: Table Matrix View */}
              {viewMode === "table" && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950/80 text-slate-300 uppercase text-[11px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Program</th>
                        <th className="py-3.5 px-4 font-semibold">Duration</th>
                        <th className="py-3.5 px-4 font-semibold">Regular Fee</th>
                        <th className="py-3.5 px-4 font-semibold text-amber-400">
                          Founder&apos;s Fee (40% OFF)
                        </th>
                        <th className="py-3.5 px-4 font-semibold text-emerald-400">Your Savings</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {category.programs.map((program) => (
                        <tr
                          key={program.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="py-3 px-4 font-medium text-white">
                            <div className="flex items-center gap-2">
                              <span>{program.name}</span>
                              {program.popular && (
                                <Badge variant="secondary" className="text-[10px] bg-rose-950 text-rose-300 border-rose-800">
                                  Popular
                                </Badge>
                              )}
                              {program.bestValue && (
                                <Badge variant="secondary" className="text-[10px] bg-amber-950 text-amber-300 border-amber-800">
                                  Best Value
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{program.duration}</td>
                          <td className="py-3 px-4 line-through text-slate-500 font-mono">
                            {formatCurrency(program.regularFee.toString())}
                          </td>
                          <td className="py-3 px-4 font-bold text-amber-400 font-mono text-base">
                            {formatCurrency(program.foundersFee.toString())}
                          </td>
                          <td className="py-3 px-4 font-semibold text-emerald-400 font-mono">
                            Save {formatCurrency(program.savings.toString())}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              size="sm"
                              onClick={() => handleCourseInquire(program.name)}
                              className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-8 px-3"
                            >
                              Enroll Now
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-slate-950/60 text-right text-xs text-slate-400 border-t border-slate-800">
                    * Admission Fee of ₹{category.admissionFee} is extra and applicable one-time at registration.
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Fabric Painting Masterclass Spotlight (from Brochure 3) */}
      <section id="fabric-art-section" className="py-14 bg-gradient-to-b from-slate-900/60 via-rose-950/20 to-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                <Palette className="h-3.5 w-3.5 text-rose-400" />
                <span>SPECIALIZED ARTISAN CRAFT</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Professional Fabric Painting Courses
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                &ldquo;Paint Your Imagination on Fabric.&rdquo; From royal Pichwai lotuses to intricate Kalamkari and Madhubani heritage art, learn how to transform plain sarees, dupattas, and bridal lehengas into wearable masterpieces.
              </p>

              {/* What You Will Learn Grid */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                  Syllabus Masterclass Includes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Brush Techniques & Color Mixing",
                    "Floral, Traditional & Modern Designs",
                    "Saree, Dupatta & Blouse Painting",
                    "Kalamkari, Pichwai, Madhubani & More",
                    "3D, Texture & Metallic Painting",
                    "Bridal & Designer Collections",
                    "Live Projects & Client Work Training",
                    "Pricing & Product Development",
                    "Instagram Selling & Business Guidance",
                    "Portfolio Development for Clients",
                  ].map((topic, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 flex items-center gap-3">
                <Button
                  onClick={() => handleCourseInquire("Advanced Fabric Painting")}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold gap-2"
                >
                  Join Fabric Painting Masterclass
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const fabCat = BROCHURE_CATEGORIES.find((c) => c.id === "fabric-painting");
                    if (fabCat) handleOpenBrochure(fabCat);
                  }}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5"
                >
                  <Eye className="h-4 w-4" /> View Flyer
                </Button>
              </div>
            </div>

            {/* Right visual card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden space-y-4">
                <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-800">
                  <Image
                    src="/images/brochures/fabric-painting-brochure.jpg"
                    alt="Fabric Painting Saree and Dupatta Art at Radhe Vastraz"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                      Founder&apos;s Batch: 40% OFF
                    </span>
                    <p className="text-sm font-bold mt-1">Basic (1M) & Advanced (3M)</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Regular: ₹25,000 / ₹75,000</span>
                  <span className="text-amber-400 font-bold font-mono">
                    Founder Fee: ₹15,000 / ₹45,000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. "Every Course Includes" (Brochure Guarantee) */}
      <section id="features-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-rose-400 border-rose-500/30 mb-3 px-3 py-1">
            Complete Student Experience
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Every Course Includes
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            No matter which program you choose, you get our complete vocational toolkit designed to launch your career.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GENERAL_INCLUSIONS.map((item, idx) => (
            <Card key={idx} className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all shadow-md">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  {item.icon === "GraduationCap" && <GraduationCap className="h-5 w-5" />}
                  {item.icon === "Scissors" && <Scissors className="h-5 w-5" />}
                  {item.icon === "Award" && <Award className="h-5 w-5" />}
                  {item.icon === "Layers" && <Layers className="h-5 w-5" />}
                  {item.icon === "Heart" && <Heart className="h-5 w-5" />}
                  {item.icon === "Briefcase" && <Briefcase className="h-5 w-5" />}
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Comprehensive Fee Tables Anchor Section */}
      <section id="fee-tables" className="py-14 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Transparent Fee Schedules
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Compare durations, regular prices, and founder discount rates across all 13 programs.
            </p>
          </div>

          <div className="space-y-8">
            {BROCHURE_CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    {cat.title} ({cat.programs.length} Programs)
                  </h3>
                  <button
                    onClick={() => handleOpenBrochure(cat)}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" /> View Flyer
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950 text-slate-300 uppercase text-[11px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Program</th>
                        <th className="py-3 px-4 font-semibold">Duration</th>
                        <th className="py-3 px-4 font-semibold">Regular Fee</th>
                        <th className="py-3 px-4 font-semibold text-amber-400">Founder&apos;s Fee (40% OFF)</th>
                        <th className="py-3 px-4 font-semibold text-emerald-400">Savings</th>
                        <th className="py-3 px-4 font-semibold text-right">Quick Apply</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {cat.programs.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-white">{p.name}</td>
                          <td className="py-2.5 px-4 text-slate-300">{p.duration}</td>
                          <td className="py-2.5 px-4 line-through text-slate-500 font-mono">
                            {formatCurrency(p.regularFee.toString())}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-amber-400 font-mono">
                            {formatCurrency(p.foundersFee.toString())}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-emerald-400 font-mono">
                            Save {formatCurrency(p.savings.toString())}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => handleCourseInquire(p.name)}
                              className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
                            >
                              Inquire &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Fast Admissions & Inquiry Form Section */}
      <section id="inquiry-form-section" className="py-16 sm:py-20 border-t border-slate-800 max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-amber-400 border-amber-500/30 px-3 py-1">
              Admissions Open • Founder&apos;s Batch
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reserve Your Seat Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Fill out this quick form and our academic counselor will contact you via WhatsApp or call to discuss batch timing and seat reservation.
            </p>
          </div>

          <form onSubmit={handleInquirySubmit} className="space-y-4 max-w-lg mx-auto">
            <div className="space-y-1.5">
              <Label htmlFor="inq-name" className="text-xs text-slate-300">
                Full Name *
              </Label>
              <Input
                id="inq-name"
                placeholder="Enter your full name"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                required
                className="bg-slate-950/80 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inq-phone" className="text-xs text-slate-300">
                Phone Number / WhatsApp *
              </Label>
              <Input
                id="inq-phone"
                type="tel"
                placeholder="e.g. 9063643342"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                required
                className="bg-slate-950/80 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inq-course" className="text-xs text-slate-300">
                Selected Course / Program *
              </Label>
              <Select value={inquiryCourse} onValueChange={setInquiryCourse}>
                <SelectTrigger id="inq-course" className="bg-slate-950/80 border-slate-700 text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="max-h-80 bg-slate-900 border-slate-800 text-white">
                  {BROCHURE_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="py-1">
                      <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-slate-800/60">
                        {cat.title}
                      </div>
                      {cat.programs.map((p) => (
                        <SelectItem key={p.id} value={p.name} className="text-xs">
                          {p.name} ({p.duration} • {formatCurrency(p.foundersFee.toString())})
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inq-batch" className="text-xs text-slate-300">
                Preferred Batch Timing
              </Label>
              <Select value={inquiryBatch} onValueChange={setInquiryBatch}>
                <SelectTrigger id="inq-batch" className="bg-slate-950/80 border-slate-700 text-white">
                  <SelectValue placeholder="Select batch timing" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="Morning Batch (10:00 AM - 1:00 PM)">
                    Morning Batch (10:00 AM - 1:00 PM)
                  </SelectItem>
                  <SelectItem value="Afternoon Batch (2:00 PM - 5:00 PM)">
                    Afternoon Batch (2:00 PM - 5:00 PM)
                  </SelectItem>
                  <SelectItem value="Evening Batch (5:00 PM - 8:00 PM)">
                    Evening Batch (5:00 PM - 8:00 PM)
                  </SelectItem>
                  <SelectItem value="Weekend Fast-Track (Saturday & Sunday)">
                    Weekend Fast-Track (Saturday & Sunday)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold h-12 text-sm mt-4 shadow-xl"
            >
              {isSubmitting ? "Submitting Inquiry..." : "Submit Enrollment Inquiry"}
            </Button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> No Spam Guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <PhoneCall className="h-3.5 w-3.5 text-amber-400" /> Helpline: 9063643342
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* 9. Contact Helpline Banner */}
      <section className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Have questions about courses or fees?</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Speak directly with our senior instructors or schedule a studio visit in Hyderabad.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="tel:9063643342">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-500 text-white gap-2 font-bold shadow-lg">
                <PhoneCall className="h-4 w-4" />
                Call 9063643342
              </Button>
            </a>

            <a
              href="https://wa.me/919063643342?text=Hello%2C%20I%20am%20interested%20in%20visiting%20Radhe%20Vastraz%20Academy."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-emerald-600/50 text-emerald-400 hover:bg-emerald-950/40 gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-slate-300 text-sm">Radhe Vastraz Boutique & Fashion Academy</p>
            <p className="text-slate-400">Fashion Today • Success Tomorrow • Only at Radhe Vastraz ♡</p>
            <p className="text-slate-500 mt-1">© {new Date().getFullYear()} Radhe Vastraz Academy. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-slate-400">
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/thank-you" className="hover:text-amber-400 transition-colors">
              Thank You
            </Link>
            <Link href="/login" className="hover:text-amber-400 transition-colors">
              Staff & Student Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* 11. Modal: High-Res Brochure Flyer Preview */}
      <Dialog
        open={previewBrochure.isOpen}
        onOpenChange={(open) =>
          setPreviewBrochure((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-800 text-white p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              {previewBrochure.title} — Official Flyer
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Official printed brochure for {previewBrochure.categoryTitle} at Radhe Vastraz Academy.
            </DialogDescription>
          </DialogHeader>

          {previewBrochure.imageSrc && (
            <div className="space-y-4 pt-2">
              <div className="relative w-full h-[65vh] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <Image
                  src={previewBrochure.imageSrc}
                  alt={previewBrochure.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={previewBrochure.imageSrc}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
                >
                  <Download className="h-4 w-4" /> Download High-Res Flyer Image
                </a>

                <Button
                  onClick={() => {
                    setPreviewBrochure((prev) => ({ ...prev, isOpen: false }));
                    const form = document.getElementById("inquiry-form-section");
                    if (form) form.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-8"
                >
                  Inquire for This Track
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

