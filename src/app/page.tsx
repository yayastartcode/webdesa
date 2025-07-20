"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadDemo } from "@/components/upload-demo";
import Header from "@/components/header";
import HeroSlider from "@/components/hero-slider";

interface HeroSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

interface HeaderSettings {
  id: string;
  logoUrl: string | null;
  navigationItems: NavigationItem[];
}

export default function Home() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero slides
        const heroSlidesResponse = await fetch('/api/hero-slides');
        if (heroSlidesResponse.ok) {
          const slides = await heroSlidesResponse.json();
          setHeroSlides(slides);
        } else {
          console.error('Failed to fetch hero slides');
        }

        // Fetch header settings
        const headerResponse = await fetch('/api/header-settings');
        if (headerResponse.ok) {
          const headerData = await headerResponse.json();
          setHeaderSettings(headerData);
        } else {
          console.error('Failed to fetch header settings');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header 
        logoUrl={headerSettings?.logoUrl || undefined}
        navigationItems={headerSettings?.navigationItems || []}
      />

      {/* Hero Slider */}
      {!loading && <HeroSlider slides={heroSlides} />}

      {/* Main Content */}
      <main className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Selamat Datang di Desasa Web
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Platform web modern untuk masyarakat Indonesia, dibangun dengan teknologi terdepan
            dan desain yang indah.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Performa Tinggi
              </CardTitle>
              <CardDescription>
                Dibangun dengan Next.js 15 dan TypeScript untuk performa optimal
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Desain Modern
              </CardTitle>
              <CardDescription>
                Menggunakan Tailwind CSS dan shadcn/ui untuk tampilan yang indah
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📱 Responsif
              </CardTitle>
              <CardDescription>
                Tampilan yang sempurna di semua perangkat, dari mobile hingga desktop
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

          {/* Upload Demo */}
          <UploadDemo />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>Dibuat dengan ❤️ untuk Indonesia</p>
            <p className="text-sm mt-2">
              Powered by Next.js, TypeScript, Tailwind CSS, shadcn/ui, Prisma & Uploadthing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
