"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Scissors,
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
  Clock,
  ShieldCheck,
  LogIn,
  MapPin,
  Mail,
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
import { CLOUDINARY_ASSETS } from "@/lib/cloudinary";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "@/lib/auth/auth-client";

export function BrochureLanding() {
  const { data: sessionData } = useSession();
  const userSession = sessionData?.user;

  // Selected category tab: "all" or specific category id
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

  // Fast inquiry state - submits directly to WhatsApp
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryCourse, setInquiryCourse] = useState("Master Boutique Course");
  const [inquiryBatch, setInquiryBatch] = useState("Morning Batch (10:00 AM - 1:00 PM)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

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
    if (!inquiryName.trim()) return;

    setIsSubmitting(true);

    const messageLines = [
      "Hello Radhe Vastraz Academy,",
      "",
      "I would like to submit an admission inquiry:",
      `• Student Name: ${inquiryName.trim()}`,
      `• Selected Course: ${inquiryCourse}`,
      `• Preferred Batch: ${inquiryBatch}`,
      "",
      "Please share the syllabus, fee details, and seat availability.",
    ];

    const encodedText = encodeURIComponent(messageLines.join("\n"));
    const whatsappUrl = `https://wa.me/919063643342?text=${encodedText}`;

    // Open WhatsApp directly with prefilled inquiry
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    setWhatsappSent(true);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFF9F6] text-[#2D0612] selection:bg-[#FCEEEF] selection:text-[#6B1127] flex flex-col justify-between font-sans">
      {/* 1. Top Announcement Bar - Full Width Maroon Ribbon */}
      <div className="w-full bg-gradient-to-r from-[#4A0A17] via-[#6B1127] to-[#4A0A17] text-white text-xs sm:text-sm py-2 px-4 sm:px-8 lg:px-12 border-b border-[#D4AF37]/40 sticky top-0 z-50 shadow-md">
        <div className="w-full flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold tracking-wide text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
              Founder&apos;s Batch Admissions Open Now
            </span>
            <span className="hidden md:inline text-[#D4AF37]">|</span>
            <span className="bg-[#FAF5E8]/20 px-2.5 py-0.5 rounded-md text-[#E6C875] font-bold border border-[#D4AF37]/40 text-[11px] sm:text-xs">
              Special 40% OFF
            </span>
            <span className="hidden sm:inline text-rose-200 text-xs">Limited Seats Available</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <a
              href="tel:9063643342"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#E6C875] font-bold transition-colors text-xs"
            >
              <PhoneCall className="h-3.5 w-3.5 text-[#E6C875]" />
              <span>9063643342</span>
            </a>
            <span className="text-[#D4AF37]/50">|</span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 bg-[#D4AF37] hover:bg-[#E6C875] text-[#2A050E] px-2.5 py-0.5 rounded-md font-bold transition-colors text-xs shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header - Full Width Soft Pinkish-White */}
      <header className="w-full border-b border-[#E8D3C0] bg-[#FFFDFB]/95 backdrop-blur-md sticky top-9 z-40 shadow-xs">
        <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand with official Radhe Vastraz gold lotus emblem */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-[#D4AF37] shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/images/radhe-vastraz-logo.png"
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm text-[#5A2530] font-semibold">
            <a href="#programs-section" className="hover:text-[#6B1127] transition-colors">
              Programs
            </a>
            <a href="#fee-tables" className="hover:text-[#6B1127] transition-colors">
              Fee Structure
            </a>
            <a href="#features-section" className="hover:text-[#6B1127] transition-colors">
              Every Course Includes
            </a>
            <a href="#fabric-art-section" className="hover:text-[#6B1127] transition-colors">
              Fabric Painting
            </a>
            <a href="#inquiry-form-section" className="hover:text-[#6B1127] transition-colors">
              Admissions
            </a>
            <Link href="/login" className="hover:text-[#6B1127] transition-colors">
              Portal
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://wa.me/919063643342?text=Hi%20Radhe%20Vastraz%20Academy%2C%20I%20am%20interested%20in%20learning%20more%20about%20your%20courses."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-600/40 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 gap-1.5 h-9 px-3 rounded-lg font-medium"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span className="hidden sm:inline">WhatsApp</span>
              </Button>
            </a>

            <Link href="/login">
              <Button
                size="sm"
                className="bg-[#6B1127] hover:bg-[#801431] text-white font-bold gap-1.5 h-9 px-4 rounded-lg shadow-sm"
              >
                <LogIn className="h-4 w-4 text-[#E6C875]" />
                <span>Login</span>
              </Button>
            </Link>

            {userSession && (
              <Link href="/dashboard" className="hidden sm:inline-flex">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#6B1127]/30 text-[#6B1127] hover:bg-[#FCEEEF] gap-1.5 h-9 px-3 rounded-lg font-semibold"
                >
                  <LayoutDashboardIcon className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 3. Hero Section - Full Width with Soft Blush / Warm Pinkish-White Luxury Aesthetic */}
      <section className="relative w-full overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-[#E8D3C0] bg-gradient-to-b from-[#FFF5F2] via-[#FCF5F2] to-[#FAF0ED]">
        <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 text-center max-w-5xl mx-auto">
          {/* Official Emblem Logo at Hero Top */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl mb-3 group hover:scale-105 transition-transform shrink-0">
              <Image
                src="/images/radhe-vastraz-logo.png"
                src={CLOUDINARY_ASSETS.logo}
                alt="Radhe Vastraz Official Crest"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover"
                priority
              />
            </div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#6B1127] font-bold font-serif">
              Radhe Vastraz Boutique &amp; Fashion Academy Hyderabad
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#2D0612] tracking-tight leading-tight sm:leading-tight font-serif">
            Professional Tailoring, Fashion Designing &amp; Fabric Painting
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#5C3842] max-w-3xl mx-auto leading-relaxed">
            Hands-on studio training in boutique blouse stitching, garment construction, pattern drafting, and artisan fabric painting in Hyderabad. Admissions open for Founder&apos;s Batch with 40% discount and individual sewing workstations.
          </p>

          {/* Action CTAs - 2 Focused, Authoritative Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            <a href="#programs-section" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#6B1127] hover:bg-[#801431] text-white font-bold shadow-md gap-2 h-12 px-8 rounded-lg text-sm"
              >
                <span>Explore 13 Certified Programs</span>
                <ArrowRight className="h-4 w-4 text-[#E6C875]" />
              </Button>
            </a>

            <a
              href="https://wa.me/919063643342?text=Hello%2C%20I%20would%20like%20to%20enroll%20for%20a%20course%20at%20Radhe%20Vastraz%20Academy."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-emerald-600/50 bg-white text-emerald-800 hover:bg-emerald-50 gap-2 h-12 px-6 rounded-lg font-semibold text-sm shadow-xs"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp Admissions</span>
              </Button>
            </a>
          </div>

          {/* Authentic Trust Strip */}
          <div className="mt-10 pt-6 border-t border-[#E8D3C0]/70 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#6A4E56] font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#6B1127]" />
              <span>40% Founder&apos;s Batch Discount</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#6B1127]" />
              <span>100% Practical Studio Training</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#6B1127]" />
              <span>Individual Sewing Workstations</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#6B1127]" />
              <span>Recognized Certification</span>
            </span>
          </div>
        </div>
      </section>

      {/* 4. Interactive Program Segregation & Explorer - Full Width */}
      <section id="programs-section" className="py-12 sm:py-16 w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
        {/* Section Heading with Brochure Style Diamond Ribbon */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-block px-4 py-1 rounded-md bg-[#6B1127] text-[#E6C875] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            FEE STRUCTURE &amp; CURRICULUM
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2D0612] tracking-tight font-serif">
            Select Your Creative Career Track
          </h2>
          <p className="text-sm sm:text-base text-[#6A4E56] mt-2">
            Explore 13 certified vocational programs segregated across Boutique Tailoring, Fashion Designing, and Traditional Artisan Fabric Painting.
          </p>
        </div>

        {/* Category Segregation Switcher Tabs - Mobile Touch Friendly */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8D3C0]">
          {/* Scrollable Track Tabs on Mobile */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-[#E8D3C0] overflow-x-auto no-scrollbar w-full md:w-auto shadow-xs">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                activeCategory === "all"
                  ? "bg-[#6B1127] text-white shadow-sm"
                  : "text-[#6A404B] hover:text-[#2D0612] hover:bg-[#FCF6F4]"
              }`}
            >
              <span>All Tracks</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                activeCategory === "all" ? "bg-white/20 text-[#E6C875]" : "bg-[#FCEEEF] text-[#6B1127]"
              }`}>
                {totalCourseCount}
              </span>
            </button>

            {BROCHURE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-[#6B1127] text-white shadow-sm"
                    : "text-[#6A404B] hover:text-[#2D0612] hover:bg-[#FCF6F4]"
                }`}
              >
                {cat.id === "boutique" && <Scissors className={`h-3.5 w-3.5 ${activeCategory === cat.id ? "text-[#E6C875]" : "text-[#6B1127]"}`} />}
                {cat.id === "fashion-designing" && <GraduationCap className={`h-3.5 w-3.5 ${activeCategory === cat.id ? "text-[#E6C875]" : "text-[#6B1127]"}`} />}
                {cat.id === "fabric-painting" && <Palette className={`h-3.5 w-3.5 ${activeCategory === cat.id ? "text-[#E6C875]" : "text-[#6B1127]"}`} />}
                <span>{cat.shortTitle}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  activeCategory === cat.id ? "bg-white/20 text-[#E6C875]" : "bg-[#FCEEEF] text-[#6B1127]"
                }`}>
                  {cat.programs.length}
                </span>
              </button>
            ))}
          </div>

          {/* View toggle (Cards vs Table) */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-[#6A4E56]">
            <span>View Mode:</span>
            <div className="flex rounded-lg bg-white border border-[#E8D3C0] p-0.5 shadow-xs">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
                  viewMode === "cards" ? "bg-[#6B1127] text-white" : "hover:text-[#2D0612]"
                }`}
              >
                Cards View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
                  viewMode === "table" ? "bg-[#6B1127] text-white" : "hover:text-[#2D0612]"
                }`}
              >
                Table Matrix
              </button>
            </div>
          </div>
        </div>

        {/* Displaying Categories - Full Width Desktop Layout */}
        <div className="space-y-16 w-full">
          {displayedCategories.map((category) => (
            <div
              key={category.id}
              className="space-y-6 pt-2 w-full"
              id={`cat-${category.id}`}
            >
              {/* Category Header Card - Deep Maroon with Gold Accents */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#5A0A1A] via-[#6B1127] to-[#4A0815] border border-[#D4AF37]/50 text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FAF5E8] text-[#5A0A1A] uppercase tracking-wide">
                      {category.badge}
                    </span>
                    <span className="text-xs text-rose-200">
                      {category.programs.length} Certified Programs
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
                    {category.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#E6C875] font-medium">
                    &ldquo;{category.tagline}&rdquo;: {category.subtitle}
                  </p>
                </div>

                {/* Brochure View button */}
                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    onClick={() => handleOpenBrochure(category)}
                    className="bg-[#FAF5E8] hover:bg-white text-[#5A0A1A] border border-[#D4AF37] font-bold gap-2 shadow-sm rounded-lg"
                  >
                    <Eye className="h-4 w-4 text-[#6B1127]" />
                    <span>View Official Flyer</span>
                  </Button>
                </div>
              </div>

              {/* Mode: Cards View - Multi-Column Full Width on White-Pinkish Background */}
              {viewMode === "cards" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full">
                  {category.programs.map((program) => (
                    <Card
                      key={program.id}
                      className={`relative flex flex-col justify-between bg-white border-[#E8D3C0] hover:border-[#6B1127]/60 transition-all hover:shadow-xl hover:-translate-y-1 rounded-xl shadow-xs ${
                        program.bestValue
                          ? "ring-2 ring-[#D4AF37]"
                          : program.popular
                          ? "ring-2 ring-[#6B1127]"
                          : ""
                      }`}
                    >
                      {/* Ribbon tag */}
                      {program.bestValue && (
                        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-[#1A030A] shadow-md">
                          Recommended Program
                        </div>
                      )}
                      {program.popular && !program.bestValue && (
                        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#6B1127] text-white shadow-md">
                          Popular Choice
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <CardTitle className="text-lg font-bold text-[#2D0612] group-hover:text-[#6B1127] transition-colors">
                            {program.name}
                          </CardTitle>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs text-[#6B1127] bg-[#FCEEEF] border border-[#6B1127]/20 px-2.5 py-1 rounded-md font-semibold w-fit">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Duration: {program.duration}</span>
                        </div>
                        <CardDescription className="text-xs text-[#6A4E56] line-clamp-2 mt-2 leading-relaxed">
                          {program.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-0">
                        {/* Price box with Soft Blush Styling */}
                        <div className="p-3.5 rounded-xl bg-[#FCF6F4] border border-[#EFE2DB] space-y-1.5">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-[#8C7A80]">Regular Fee:</span>
                            <span className="text-xs line-through text-slate-400 font-mono">
                              {formatCurrency(program.regularFee.toString())}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-xs font-bold text-[#6B1127] block">
                                Founder&apos;s Batch:
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold">
                                Flat 40% OFF Special
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-extrabold text-[#6B1127] font-mono block">
                                {formatCurrency(program.foundersFee.toString())}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold block">
                                You Save {formatCurrency(program.savings.toString())}
                              </span>
                            </div>
                          </div>
                          <div className="text-[10px] text-[#7A5B64] border-t border-[#E8D3C0] pt-1.5 text-right font-medium">
                            + Admission Fee: ₹{category.admissionFee} (one-time)
                          </div>
                        </div>

                        {/* Program highlights list */}
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-bold text-[#6B1127] uppercase tracking-wider">
                            Key Skills Covered:
                          </p>
                          <ul className="space-y-1 text-xs text-[#452830]">
                            {program.highlights.slice(0, 3).map((h, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA button */}
                        <div className="pt-2">
                          <Button
                            onClick={() => handleCourseInquire(program.name)}
                            className="w-full bg-[#6B1127] hover:bg-[#801431] text-white transition-colors gap-2 text-xs h-10 rounded-lg font-bold shadow-xs"
                          >
                            <span>Enroll in This Program</span>
                            <ArrowRight className="h-3.5 w-3.5 text-[#E6C875]" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Mode: Table Matrix View - Direct replica of the physical brochure fee structure */}
              {viewMode === "table" && (
                <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <div className="rounded-xl border border-[#D4AF37]/50 bg-white shadow-xl overflow-hidden min-w-[620px]">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#6B1127] text-white uppercase text-[11px] sm:text-xs tracking-wider border-b border-[#D4AF37]/30">
                        <tr>
                          <th className="py-3.5 px-4 font-bold">PROGRAM</th>
                          <th className="py-3.5 px-4 font-bold">DURATION</th>
                          <th className="py-3.5 px-4 font-bold">REGULAR FEE</th>
                          <th className="py-3.5 px-4 font-bold text-[#E6C875]">
                            FOUNDER&apos;S BATCH FEE (40% OFF)
                          </th>
                          <th className="py-3.5 px-4 font-bold text-emerald-300">SAVINGS</th>
                          <th className="py-3.5 px-4 font-bold text-right">QUICK ENROLL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0E2DB]">
                        {category.programs.map((program, idx) => (
                          <tr
                            key={program.id}
                            className={`transition-colors hover:bg-[#FDF4F2] ${
                              idx % 2 === 0 ? "bg-white" : "bg-[#FFF9F7]"
                            }`}
                          >
                            <td className="py-3.5 px-4 font-bold text-[#2D0612]">
                              <div className="flex items-center gap-2">
                                <span>{program.name}</span>
                                {program.popular && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#6B1127] text-white font-semibold">
                                    Popular
                                  </span>
                                )}
                                {program.bestValue && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#1A030A] font-bold">
                                    Best Value
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#5A3840] font-medium">{program.duration}</td>
                            <td className="py-3.5 px-4 line-through text-slate-400 font-mono">
                              {formatCurrency(program.regularFee.toString())}
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-[#6B1127] font-mono text-base">
                              {formatCurrency(program.foundersFee.toString())}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono">
                              Save {formatCurrency(program.savings.toString())}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Button
                                size="sm"
                                onClick={() => handleCourseInquire(program.name)}
                                className="bg-[#6B1127] hover:bg-[#801431] text-white text-xs h-8 px-3 rounded-lg font-bold"
                              >
                                Enroll
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Table Footer Banner from Brochure */}
                    <div className="bg-[#FCF3F1] px-4 py-3 border-t border-[#E8D3C0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-[#6B1127] font-bold">
                        <span>Admission Fee: ₹{category.admissionFee} (Extra)</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-[#6A4E56] font-normal">Includes starter practical tools kit</span>
                      </div>
                      <span className="text-[#8C1833] font-serif italic text-xs font-bold">Limited Seats Only!</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Fabric Painting Masterclass Spotlight (from Brochure 2) - Full Width */}
      <section id="fabric-art-section" className="py-14 sm:py-18 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 bg-gradient-to-b from-[#FDF5F2] via-[#FAF0ED] to-[#FFF9F6] border-y border-[#E8D3C0]">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold bg-[#FCEEEF] text-[#6B1127] border border-[#6B1127]/25">
                <Palette className="h-3.5 w-3.5 text-[#6B1127]" />
                <span>SPECIALIZED ARTISAN CRAFT</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2D0612] tracking-tight leading-tight font-serif">
                Professional Fabric Painting Courses
              </h2>
              <p className="text-sm sm:text-base text-[#5C3842] leading-relaxed">
                &ldquo;Paint Your Imagination on Fabric.&rdquo; From royal Pichwai lotuses to intricate Kalamkari and Madhubani heritage art, learn how to transform plain sarees, dupattas, and bridal lehengas into wearable masterpieces.
              </p>

              {/* What You Will Learn Grid from Brochure */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6B1127] mb-3">
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
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-[#E8D3C0] text-xs text-[#2D0612] shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#6B1127] shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => handleCourseInquire("Advanced Fabric Painting")}
                  className="bg-[#6B1127] hover:bg-[#801431] text-white font-bold gap-2 h-11 px-6 rounded-lg shadow-md"
                >
                  <span>Join Fabric Painting Masterclass</span>
                  <ArrowRight className="h-4 w-4 text-[#E6C875]" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const fabCat = BROCHURE_CATEGORIES.find((c) => c.id === "fabric-painting");
                    if (fabCat) handleOpenBrochure(fabCat);
                  }}
                  className="border-[#E8D3C0] bg-white text-[#6B1127] hover:bg-[#FCEEEF] gap-1.5 h-11 px-5 rounded-lg font-semibold"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Original Flyer</span>
                </Button>
              </div>
            </div>

            {/* Right visual card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-white border border-[#E8D3C0] shadow-xl relative overflow-hidden space-y-4">
                <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-[#E8D3C0] bg-slate-100">
                  <Image
                    src="/images/brochures/fabric-painting-brochure.jpg"
                    src={CLOUDINARY_ASSETS.fabricPaintingBrochure}
                    alt="Fabric Painting Saree and Dupatta Art at Radhe Vastraz"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37] text-[#120206]">
                      Founder&apos;s Batch: 40% OFF
                    </span>
                    <p className="text-sm font-bold mt-1 font-serif">Basic (1M) &amp; Advanced (3M)</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6A4E56] pt-1">
                  <span>Regular: ₹25,000 / ₹75,000</span>
                  <span className="text-[#6B1127] font-bold font-mono">
                    Founder Fee: ₹15,000 / ₹45,000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. "Every Course Includes" (Brochure Guarantee) - 6 Column Full Width on Desktop */}
      <section id="features-section" className="py-14 sm:py-18 w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-1 rounded-md bg-[#6B1127] text-[#E6C875] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            EVERY COURSE INCLUDES
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2D0612] tracking-tight font-serif">
            The Complete Academy Guarantee
          </h2>
          <p className="text-sm sm:text-base text-[#6A4E56] mt-2">
            No matter which program you choose, you get our complete vocational toolkit designed to launch your career.
          </p>
        </div>

        {/* 6-Column Grid matching the 6 icons across all 3 brochures */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {GENERAL_INCLUSIONS.map((item, idx) => (
            <Card
              key={idx}
              className="bg-white border-[#E8D3C0] hover:border-[#6B1127]/50 transition-all shadow-xs hover:shadow-md rounded-xl text-center flex flex-col justify-between"
            >
              <CardContent className="p-5 flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#6B1127] text-[#E6C875] flex items-center justify-center shadow-sm shrink-0">
                  {item.icon === "GraduationCap" && <GraduationCap className="h-6 w-6" />}
                  {item.icon === "Scissors" && <Scissors className="h-6 w-6" />}
                  {item.icon === "Award" && <Award className="h-6 w-6" />}
                  {item.icon === "Layers" && <Layers className="h-6 w-6" />}
                  {item.icon === "Heart" && <Heart className="h-6 w-6" />}
                  {item.icon === "Briefcase" && <Briefcase className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2D0612]">{item.title}</h3>
                  <p className="text-xs text-[#6A4E56] mt-1 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Comprehensive Fee Tables Section - Full Width */}
      <section id="fee-tables" className="py-14 sm:py-18 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 bg-[#FFF5F2] border-t border-[#E8D3C0]">
        <div className="w-full">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D0612] tracking-tight font-serif">
              Transparent Fee Schedules Across All Tracks
            </h2>
            <p className="text-sm text-[#6A4E56] mt-1">
              Compare durations, regular fees, and founder discount rates across all 13 accredited programs.
            </p>
          </div>

          <div className="space-y-10 w-full">
            {BROCHURE_CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-[#2D0612] flex items-center gap-2 font-serif">
                    <span className="h-2 w-2 rounded-full bg-[#6B1127]" />
                    <span>{cat.title}</span>
                    <span className="text-xs text-[#6A4E56] font-sans font-normal">
                      ({cat.programs.length} Programs)
                    </span>
                  </h3>
                  <button
                    onClick={() => handleOpenBrochure(cat)}
                    className="text-xs text-[#6B1127] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Official Flyer</span>
                  </button>
                </div>

                <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <div className="rounded-xl border border-[#D4AF37]/50 bg-white overflow-hidden min-w-[620px] shadow-sm">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#6B1127] text-white uppercase text-[11px] tracking-wider border-b border-[#D4AF37]/30">
                        <tr>
                          <th className="py-3 px-4 font-bold">PROGRAM</th>
                          <th className="py-3 px-4 font-bold">DURATION</th>
                          <th className="py-3 px-4 font-bold">REGULAR FEE</th>
                          <th className="py-3 px-4 font-bold text-[#E6C875]">FOUNDER&apos;S FEE (40% OFF)</th>
                          <th className="py-3 px-4 font-bold text-emerald-300">SAVINGS</th>
                          <th className="py-3 px-4 font-bold text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0E2DB]">
                        {cat.programs.map((p, pIdx) => (
                          <tr
                            key={p.id}
                            className={`transition-colors hover:bg-[#FDF4F2] ${
                              pIdx % 2 === 0 ? "bg-white" : "bg-[#FFF9F7]"
                            }`}
                          >
                            <td className="py-3 px-4 font-bold text-[#2D0612]">{p.name}</td>
                            <td className="py-3 px-4 text-[#5A3840] font-medium">{p.duration}</td>
                            <td className="py-3 px-4 line-through text-slate-400 font-mono">
                              {formatCurrency(p.regularFee.toString())}
                            </td>
                            <td className="py-3 px-4 font-extrabold text-[#6B1127] font-mono text-base">
                              {formatCurrency(p.foundersFee.toString())}
                            </td>
                            <td className="py-3 px-4 font-bold text-emerald-700 font-mono">
                              Save {formatCurrency(p.savings.toString())}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                size="sm"
                                onClick={() => handleCourseInquire(p.name)}
                                className="bg-[#6B1127] hover:bg-[#801431] text-white text-xs h-8 px-3 rounded-lg font-bold"
                              >
                                Enroll
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Fast Admissions Inquiry Section - Full Width */}
      <section
        id="inquiry-form-section"
        className="py-16 sm:py-20 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 bg-[#FFFDFB] border-t border-[#E8D3C0]"
      >
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <div className="inline-block px-4 py-1 rounded-md bg-[#6B1127] text-[#E6C875] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider shadow-xs">
              ADMISSIONS OPEN NOW
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2D0612] tracking-tight font-serif">
              Secure Your Founder&apos;s Batch Seat
            </h2>
            <p className="text-xs sm:text-sm text-[#6A4E56] max-w-xl mx-auto">
              Limited seats per batch to guarantee individual sewing workstations and dedicated instructor guidance.
            </p>
          </div>

          {/* Form Card with Maroon & Gold Trim on Clean White Parchment */}
          <form
            onSubmit={handleInquirySubmit}
            className="p-6 sm:p-10 rounded-2xl bg-white border border-[#D4AF37]/60 shadow-xl space-y-5"
          >
            <div className="space-y-1.5">
              <Label htmlFor="inq-name" className="text-xs text-[#2D0612] font-bold">
                Full Name *
              </Label>
              <Input
                id="inq-name"
                placeholder="Enter your full name"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                required
                className="bg-[#FFF9F6] border-[#E8D3C0] text-[#2D0612] h-11 rounded-lg focus-visible:ring-[#6B1127]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inq-course" className="text-xs text-[#2D0612] font-bold">
                Selected Course / Program *
              </Label>
              <Select value={inquiryCourse} onValueChange={setInquiryCourse}>
                <SelectTrigger id="inq-course" className="bg-[#FFF9F6] border-[#E8D3C0] text-[#2D0612] h-11 rounded-lg">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="max-h-80 bg-white border-[#E8D3C0] text-[#2D0612]">
                  {BROCHURE_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="py-1">
                      <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-[#6B1127]">
                        {cat.title}
                      </div>
                      {cat.programs.map((p) => (
                        <SelectItem key={p.id} value={p.name} className="text-xs hover:bg-[#FCEEEF]">
                          {p.name} ({p.duration} | {formatCurrency(p.foundersFee.toString())})
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inq-batch" className="text-xs text-[#2D0612] font-bold">
                Preferred Batch Timing
              </Label>
              <Select value={inquiryBatch} onValueChange={setInquiryBatch}>
                <SelectTrigger id="inq-batch" className="bg-[#FFF9F6] border-[#E8D3C0] text-[#2D0612] h-11 rounded-lg">
                  <SelectValue placeholder="Select batch timing" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E8D3C0] text-[#2D0612]">
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
                    Weekend Fast-Track (Saturday &amp; Sunday)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#128C7E] hover:bg-[#0C6E63] text-white font-bold h-12 text-sm mt-4 shadow-lg rounded-lg gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{isSubmitting ? "Opening WhatsApp..." : "Send Inquiry via WhatsApp"}</span>
            </Button>

            <p className="text-[11px] text-center text-[#6A4E56]">
              Your inquiry details will open directly in WhatsApp to chat with our admissions desk. Radhe Vastraz receives your number automatically when you send.
            </p>

            {whatsappSent && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>
                    WhatsApp opened! If it didn&apos;t launch automatically,{" "}
                    <a
                      href={`https://wa.me/919063643342?text=${encodeURIComponent(
                        [
                          "Hello Radhe Vastraz Academy,",
                          "",
                          "I would like to submit an admission inquiry:",
                          `• Student Name: ${inquiryName.trim()}`,
                          `• Selected Course: ${inquiryCourse}`,
                          `• Preferred Batch: ${inquiryBatch}`,
                          "",
                          "Please share the syllabus, fee details, and seat availability.",
                        ].join("\n")
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-emerald-700 hover:text-emerald-800"
                    >
                      click here to send via WhatsApp
                    </a>.
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 text-xs text-[#6A4E56] pt-2 flex-wrap border-t border-[#EFE2DB]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Direct Counselor Connection
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1 font-semibold text-[#6B1127]">
                <PhoneCall className="h-3.5 w-3.5" /> Admissions Hotline: 9063643342
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* 9. Contact Helpline & Studio Visit Banner - Full Width */}
      <section className="py-14 sm:py-16 w-full px-4 sm:px-8 lg:px-12 2xl:px-16 bg-[#FDF5F2] border-t border-[#E8D3C0]">
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-block px-3 py-1 rounded-md bg-[#6B1127] text-[#E6C875] text-[11px] font-bold uppercase tracking-wider">
              VISIT OUR STORE &amp; ACADEMY
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#2D0612] font-serif">
              Visit Our Studio in Hyderabad
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-[#5C3842] leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#6B1127] shrink-0 mt-0.5" />
                <span>Shop No. 1, Jal Vayu Vihar, Kukatpally, backside of community office building, Hyderabad, Telangana, India (500085).</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs pt-1">
                <span className="flex items-center gap-1.5 font-bold text-[#2D0612]">
                  <PhoneCall className="h-3.5 w-3.5 text-[#6B1127]" />
                  <span>+91 9063643342 (Contact: Divya)</span>
                </span>
                <a href="mailto:radhevastraz@gmail.com" className="flex items-center gap-1.5 text-[#5C3842] hover:text-[#6B1127]">
                  <Mail className="h-3.5 w-3.5 text-[#6B1127]" />
                  <span>radhevastraz@gmail.com</span>
                </a>
                <span className="text-[#8A6A74]">
                  Support: raadhelabel@gmail.com
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a href="tel:9063643342">
              <Button
                size="lg"
                className="bg-[#6B1127] hover:bg-[#801431] text-white gap-2 font-bold shadow-md rounded-lg h-12 px-6"
              >
                <PhoneCall className="h-4 w-4 text-[#E6C875]" />
                <span>Call: 9063643342</span>
              </Button>
            </a>

            <a
              href="https://wa.me/919063643342?text=Hello%20Divya%2C%20I%20am%20interested%20in%20visiting%20the%20Radhe%20Vastraz%20Academy%20at%20Kukatpally."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-[#128C7E] hover:bg-[#0C6E63] text-white gap-2 rounded-lg h-12 px-6 font-bold shadow-md"
              >
                <MessageCircle className="h-4 w-4 text-white" />
                <span>WhatsApp Divya</span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 10. Footer - Full Width Grounded Contrast */}
      <footer className="border-t border-[#3D0A16] bg-[#24040E] py-10 text-xs text-[#E0D2C0] w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-[#D4AF37]/60 shadow-md shrink-0">
              <Image
                src="/images/radhe-vastraz-logo.png"
                src={CLOUDINARY_ASSETS.logo}
                alt="Radhe Vastraz"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-white text-sm font-serif">Radhe Vastraz Boutique &amp; Fashion Academy</p>
              <p className="text-[#C8B8A6]">Shop No. 1, Jal Vayu Vihar, Kukatpally, Hyderabad (500085) • Divya: +91 9063643342</p>
              <p className="text-slate-400 mt-1">© {new Date().getFullYear()} Radhe Vastraz Academy. All rights reserved. • radhevastraz@gmail.com</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#E0D2C0]">
            <Link href="/privacy" className="hover:text-[#E6C875] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#E6C875] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/thank-you" className="hover:text-[#E6C875] transition-colors">
              Thank You
            </Link>
            <Link href="/login" className="hover:text-white text-[#E6C875] font-bold transition-colors inline-flex items-center gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
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
        <DialogContent className="max-w-4xl bg-white border-[#D4AF37]/50 text-[#2D0612] p-4 sm:p-6 max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 font-serif text-[#6B1127]">
              <GraduationCap className="h-5 w-5 text-[#D4AF37]" />
              {previewBrochure.title}: Official Flyer
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6A4E56]">
              Official printed brochure for {previewBrochure.categoryTitle} at Radhe Vastraz Academy.
            </DialogDescription>
          </DialogHeader>

          {previewBrochure.imageSrc && (
            <div className="space-y-4 pt-2">
              <div className="relative w-full h-[60vh] sm:h-[72vh] rounded-xl overflow-hidden border border-[#E8D3C0] bg-slate-100">
                <Image
                  src={previewBrochure.imageSrc}
                  alt={previewBrochure.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <a
                  href={previewBrochure.imageSrc}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#6B1127] hover:underline font-bold"
                >
                  <Download className="h-4 w-4" /> Download High-Res Flyer Image
                </a>

                <Button
                  onClick={() => {
                    setPreviewBrochure((prev) => ({ ...prev, isOpen: false }));
                    const form = document.getElementById("inquiry-form-section");
                    if (form) form.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-[#6B1127] hover:bg-[#801431] text-white text-xs h-9 px-5 rounded-lg font-bold w-full sm:w-auto"
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
