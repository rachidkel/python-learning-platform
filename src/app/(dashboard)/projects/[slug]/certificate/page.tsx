"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const [name, setName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { slug } = await params;
        const [sessionRes, projectRes] = await Promise.all([
          fetch("/api/auth/session").then((r) => r.json()),
          fetch(`/api/project-info/${slug}`).then((r) => r.json()),
        ]);
        if (sessionRes?.user?.name) setName(sessionRes.user.name);
        if (projectRes?.title) setProjectTitle(projectRes.title);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Control Panel (Hidden when printing) */}
      <div className="mx-auto max-w-4xl mt-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm print:hidden">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-ink-700 mb-2">
            Customize your name on the certificate:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full max-w-md rounded-lg border border-ink-300 px-4 py-2 text-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex items-center gap-3">
          <Link href="/projects">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <Button onClick={() => window.print()} className="bg-brand-600 text-white hover:bg-brand-700">
            <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* =========================================================
          THE CERTIFICATE DESIGN (CodeSignal Style)
          Wrapped in print-page-wrapper to guarantee 1 page.
          ========================================================= */}
      <div className="print-page-wrapper w-full py-12 flex justify-center bg-ink-50 print:bg-white">
        <div className="print-certificate relative w-full max-w-[1000px] aspect-[1.414/1] bg-white shadow-2xl overflow-hidden flex flex-col font-sans border-[1px] border-ink-200">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
          
          {/* Inner Border */}
          <div className="absolute inset-4 border-[2px] border-brand-500 rounded-lg pointer-events-none" />
          
          {/* Corner Decorative Element */}
          <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-brand-600 rounded-tl-xl" />
          <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-brand-600 rounded-br-xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-16 md:p-20">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
                  <Award className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-ink-900">PyLearn</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-ink-500 uppercase tracking-widest">Certificate of Completion</p>
                <p className="text-xs text-ink-400">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>

            {/* Main Body */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-lg text-ink-600 mb-2">This certificate is awarded to</p>
              <h1 className="text-5xl md:text-6xl font-bold text-ink-900 tracking-tight mb-8 border-b pb-6 border-ink-200">
                {name || "Your Name Here"}
              </h1>
              
              <p className="text-lg text-ink-600 mb-4">For successfully completing the project</p>
              <h2 className="text-3xl font-semibold text-brand-700 mb-6 flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-brand-500" />
                {projectTitle || "Real-World Python Project"}
              </h2>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between mt-12 pt-8 border-t border-ink-200">
              <div>
                <p className="font-bold text-lg text-ink-900">
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <p className="text-sm text-ink-500">Date of Completion</p>
              </div>

              <div className="text-right">
                <p className="font-serif italic text-2xl text-ink-800 mb-1">PyLearn Academy</p>
                <p className="text-sm text-ink-500">Authorized Signature</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}