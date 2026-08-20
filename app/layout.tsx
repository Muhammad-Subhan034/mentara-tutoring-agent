import type { Metadata } from "next";
import { Newsreader, Inter, Space_Mono, Caveat } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import GrainOverlay from "@/components/GrainOverlay";
import ConceptGraph from "@/components/ConceptGraph";
import ScrollProgress from "@/components/ScrollProgress";
import ChalkCursor from "@/components/ChalkCursor";
import Nav from "@/components/Nav";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Mentara — adaptive tutoring agent",
  description:
    "Diagnoses exactly which concept a student is shaky on, then teaches it Socratically — guiding questions, never the answer outright.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${spaceMono.variable} ${caveat.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-board text-chalk font-body antialiased">
        <ConceptGraph />
        <ScrollProgress />
        <ChalkCursor />
        <SmoothScrollProvider>
          <GrainOverlay />
          <Nav />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
