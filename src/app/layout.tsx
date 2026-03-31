import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dev-swipe-eight.vercel.app/"),
  title: "DevSwipe - The Tinder for Developers",
  description: "Swipe, match, and build your dream team. The ultimate matching platform to find co-founders and developers for your next groundbreaking project.",
  keywords: ["developer matchmaking", "find a co-founder", "programmer networking", "tinder for devs", "devswipe", "open source collaboration"],
  
  // Facebook, LinkedIn, aur WhatsApp waghera isko parhte hain
  openGraph: {
    type: "website",
    url: "https://dev-swipe-eight.vercel.app/",
    title: "DevSwipe | Swipe. Match. Code.",
    description: "The smartest way to find developers who complement your tech stack. Start building your dream team today.",
    siteName: "DevSwipe",
    images: [
      {
        url: "/og.png", // Aapke public folder mein rakhi hui image yahan fetch hogi
        width: 1200,
        height: 630,
        alt: "DevSwipe - Find Your Dev Partner",
      },
    ],
  },
  
  // Twitter is SEO part ko parhta hai
  twitter: {
    card: "summary_large_image",
    title: "DevSwipe - Connect with Top Developers",
    description: "Looking for a React developer? Or a Prisma expert? Swipe and build your team on DevSwipe.",
    images: ["/og.png"],
    creator: "@sajidsmile",
  },
  
  // Favicon updates jaha zaroorat ho
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark scroll-smooth", "font-sans", geist.variable)} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-black font-sans text-gray-200 antialiased selection:bg-indigo-500/30",
          inter.variable,
          outfit.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {/* Background Gradient Orbs */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
              <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
              <div className="absolute -right-[10%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
            </div>

            <Navbar />
            
            <main className="relative z-10 flex-1">
              {children}
            </main>

            <footer className="relative z-10 border-t border-white/5 bg-black/50 py-8 backdrop-blur-md">
              <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
                <p>© {new Date().getFullYear()} DevSwipe. Built with Next.js 15 & Prisma.</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
