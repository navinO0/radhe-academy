import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  LogIn,
  Home,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "404 - Page Not Found",
  description: "The page or course you requested could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
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

          <Link href="/login">
            <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800 text-slate-200">
              <LogIn className="h-4 w-4 mr-1.5" />
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Main 404 Hero */}
      <main className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center flex-1">
        {/* Decorative 404 Art */}
        <div className="relative mb-6">
          <div className="text-8xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center text-primary shadow-2xl backdrop-blur-md">
              <Compass className="h-8 w-8 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
          The link you followed may be broken, or the page, batch, or course might have been relocated.
        </p>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mb-8">
          <Link href="/dashboard" className="group">
            <Card className="bg-slate-900/80 border-slate-800 hover:border-primary/50 transition-all hover:shadow-lg text-left h-full">
              <CardContent className="p-4 flex flex-col items-start gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Dashboard</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Access your academy workspace</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/academy/courses" className="group">
            <Card className="bg-slate-900/80 border-slate-800 hover:border-primary/50 transition-all hover:shadow-lg text-left h-full">
              <CardContent className="p-4 flex flex-col items-start gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Courses</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Explore design & boutique syllabus</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/" className="group">
            <Card className="bg-slate-900/80 border-slate-800 hover:border-primary/50 transition-all hover:shadow-lg text-left h-full">
              <CardContent className="p-4 flex flex-col items-start gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Home className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Home</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Return to academy homepage</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Action Link */}
        <Link href="/">
          <Button size="default" className="gap-2 shadow-md">
            <Home className="h-4 w-4" />
            Return to Homepage
          </Button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 py-6 text-center text-xs text-slate-500">
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

